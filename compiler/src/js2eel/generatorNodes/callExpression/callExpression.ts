import { config } from './js2EelLib/config.js';
import { slider } from './js2EelLib/slider.js';
import { fileSelector } from './js2EelLib/fileSelector.js';
import { selectBox } from './js2EelLib/selectBox.js';
import { onInit } from './js2EelLib/onInit.js';
import { onSlider } from './js2EelLib/onSlider.js';
import { onSample } from './js2EelLib/onSample.js';
import { eachChannel } from './js2EelLib/eachChannel.js';
import { eelLibraryFunctionCall } from './eelLib/eelLibraryFunctionCall.js';

import { memberExpressionCall } from '../memberExpression/memberExpressionCall.js';
import { evaluateUserFunctionCall } from './utils/evaluateUserFunctionCall.js';
import { suffixInlineReturn } from '../../suffixersAndPrefixers/suffixInlineReturn.js';
import { prefixParam } from '../../suffixersAndPrefixers/prefixParam.js';
import { stripChannelPrefix } from '../../suffixersAndPrefixers/prefixChannel.js';
import { addSemicolonIfNone } from '../../suffixersAndPrefixers/addSemicolonIfNone.js';
import { EEL_LIBRARY_FUNCTION_NAMES } from '../../constants.js';

import type { CallExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { onBlock } from './js2EelLib/onBlock.js';

export const callExpression = (
    callExpression: CallExpression,
    instance: Js2EelCompiler
): string => {
    let callExpressionSrc = '';

    const callee = callExpression.callee;

    if ('name' in callee) {
        switch (callee.name) {
            // JS2EEL Library functions
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
            case 'fileSelector': {
                fileSelector(callExpression, instance);
                break;
            }
            case 'onInit': {
                instance.setOnInitSrc(onInit(callExpression, instance));
                break;
            }
            case 'onSlider': {
                callExpressionSrc += onSlider(callExpression, instance);
                break;
            }
            case 'onBlock': {
                callExpressionSrc += onBlock(callExpression, instance);
                break;
            }
            case 'onSample': {
                callExpressionSrc += onSample(callExpression, instance);
                break;
            }
            case 'eachChannel': {
                callExpressionSrc += eachChannel(callExpression, instance);
                break;
            }

            default: {
                // EEL Library functions
                if (EEL_LIBRARY_FUNCTION_NAMES.has(callee.name.toLowerCase())) {
                    // We can lowercase here because there's only lowercase symbols in EEL
                    callExpressionSrc += eelLibraryFunctionCall(callExpression, instance);

                    break;
                } else {
                    // User functions

                    instance.startCurrentInlineData();

                    const declaredUserFunction = instance.getDeclaredSymbolUpInScope(callee.name);

                    if (declaredUserFunction) {
                        if (declaredUserFunction.symbol.currentAssignment?.type !== 'function') {
                            instance.error('TypeError', `${callee.name} is not a function`, callee);

                            return ''; // SHOULD NOT HAPPEN
                        }

                        const { args, errors } = evaluateUserFunctionCall(
                            callExpression,
                            declaredUserFunction.symbol.currentAssignment.argDefinition,
                            instance
                        );

                        if (errors) {
                            instance.multipleErrors(errors);

                            break;
                        }

                        let replacedBodySrc = declaredUserFunction.symbol.currentAssignment.eelSrc;

                        const returnSrc = instance.getReturn(
                            declaredUserFunction.symbol.currentAssignment.ownScopePath
                        );

                        let replacedReturnSource = returnSrc?.src;

                        for (const [_key, arg] of Object.entries(args)) {
                            let cleanValue = arg.value;

                            if (typeof cleanValue === 'string') {
                                cleanValue = stripChannelPrefix(arg.value);
                            }

                            // FIXME this might hurt performance if functions get large
                            replacedBodySrc = replacedBodySrc.replaceAll(
                                `${prefixParam(arg.scopedName)}`,
                                cleanValue
                            );

                            if (replacedReturnSource) {
                                replacedReturnSource = replacedReturnSource.replaceAll(
                                    `${prefixParam(arg.scopedName)}`,
                                    cleanValue
                                );
                            }
                        }

                        const currentInlineCounter = instance.getInlineCounter();

                        if (returnSrc) {
                            callExpressionSrc += suffixInlineReturn(
                                returnSrc.symbolSrc,
                                currentInlineCounter
                            );
                        }

                        instance.addToCurrentInlineData(
                            `${replacedBodySrc}${
                                returnSrc && replacedReturnSource
                                    ? addSemicolonIfNone(
                                          `${suffixInlineReturn(
                                              returnSrc.symbolSrc,
                                              currentInlineCounter
                                          )} = ${replacedReturnSource}`,
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
                callExpressionSrc += memberExpressionCall(callExpression, instance);
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
