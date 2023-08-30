import { objectMemberExpression } from '../memberExpression/objectMemberExpression.js';
import { config } from './js2EelLib/config.js';
import { onInit } from './js2EelLib/onInit.js';
import { onSlider } from './js2EelLib/onSlider.js';
import { onSample } from './js2EelLib/onSample.js';
import { eachChannel } from './js2EelLib/eachChannel.js';
import { slider } from './js2EelLib/slider.js';
import { selectBox } from './js2EelLib/selectBox.js';
import { evaluateUserFunctionCall } from './utils/evaluateUserFunctionCall.js';
import { eelLibraryFunctionCall as eelLibraryFunctionCall } from './eelLib/eelLibraryFunctionCall.js';
import { EEL_LIBRARY_FUNCTION_NAMES } from '../../constants.js';

import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { CallExpression } from 'estree';
import { suffixInlineReturn } from '../../suffixersAndPrefixers/suffixInlineReturn.js';
import { addSemicolonIfNone } from '../../suffixersAndPrefixers/addSemicolonIfNone.js';

export const callExpression = (
    callExpression: CallExpression,
    instance: Js2EelCompiler
): string => {
    let callExpressionSrc = '';

    const callee = callExpression.callee;

    if ('name' in callee) {
        switch (callee.name) {
            // Library functions
            case 'config': {
                config(callExpression, instance);
                break;
            }
            case 'slider': {
                slider(callExpression, instance);
                break;
            }
            case 'selectBox': {
                selectBox(callExpression, instance);
                break;
            }
            case 'onInit': {
                instance.setOnInitSrc(onInit(callExpression, instance));
                break;
            }
            case 'onSlider': {
                instance.setOnSliderSrc(onSlider(callExpression, instance));
                break;
            }
            case 'onSample': {
                instance.setOnSampleSrc(onSample(callExpression, instance));
                break;
            }
            case 'eachChannel': {
                callExpressionSrc += eachChannel(callExpression, instance);
                break;
            }

            default: {
                // Library functions
                if (EEL_LIBRARY_FUNCTION_NAMES.has(callee.name.toLowerCase())) {
                    // We can lowercase here because there's only lowercase symbols in EEL
                    callExpressionSrc += eelLibraryFunctionCall(callExpression, instance);

                    break;
                } else {
                    // User functions

                    const declaredUserFunction = instance.getDeclaredSymbolUpInScope(callee.name);

                    if (declaredUserFunction) {
                        if (declaredUserFunction.symbol.type !== 'function') {
                            instance.error('TypeError', `${callee.name} is not a function`, callee);

                            return ''; // SHOULD NOT HAPPEN
                        }

                        const { args, errors } = evaluateUserFunctionCall(
                            callExpression,
                            declaredUserFunction.symbol.argDefinition,
                            declaredUserFunction.scopeSuffix,
                            instance
                        );

                        if (errors) {
                            instance.multipleErrors(errors);

                            break;
                        }

                        let inlineBody = ``;

                        for (const [_key, arg] of Object.entries(args)) {
                            inlineBody += `${arg.scopedName} = ${arg.value};\n`;
                        }

                        inlineBody += declaredUserFunction.symbol.eelSrc;

                        const returnSrc = instance.getReturn(
                            declaredUserFunction.symbol.ownScopePath
                        );

                        const currentInlineCounter = instance.getInlineCounter();

                        if (returnSrc) {
                            callExpressionSrc += suffixInlineReturn(
                                returnSrc.symbolSrc,
                                currentInlineCounter
                            );
                        }

                        instance.addToCurrentInlineData(
                            `${inlineBody}${
                                returnSrc
                                    ? addSemicolonIfNone(
                                          `${suffixInlineReturn(
                                              returnSrc.symbolSrc,
                                              currentInlineCounter
                                          )} = ${returnSrc.src}`,
                                          false
                                      )
                                    : ''
                            }`
                        );

                        instance.setSymbolUsed(callee.name);

                        break;
                    } else {
                        instance.error(
                            'UnknownSymbolError',
                            `Unknown function ${callee.name}.`,
                            callee
                        );
                    }
                }
            }
        }
    } else {
        switch (callee.type) {
            case 'MemberExpression': {
                callExpressionSrc += objectMemberExpression(callExpression, instance);
                break;
            }
            /* c8 ignore start */
            // FIXME: Don't know how to test that
            default: {
                instance.error(
                    'UnknownSymbolError',
                    `Callee type ${callee.type} not allowed.`,
                    callExpression
                );
            }
            /* c8 ignore end */
        }
    }
    return callExpressionSrc;
};
