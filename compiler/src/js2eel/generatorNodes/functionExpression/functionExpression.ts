import { blockStatement } from '../blockStatement/blockStatement.js';

import { registerDeclarationParam } from '../../declarationParams/registerDeclarationParam.js';
import { prefixChannel } from '../../suffixersAndPrefixers/prefixChannel.js';

import type { ArrowFunctionExpression, FunctionExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { ParamDefinition, ParsedFunctionParameter } from '../../types.js';

type ValidatedParams<ParamName extends string> = {
    [paramName in ParamName]: ParsedFunctionParameter;
};

export const functionExpression = <ParamName extends string>(
    functionExpression: FunctionExpression | ArrowFunctionExpression,
    paramDefinition: ParamDefinition<ParamName>[],
    parentScopeId: string,
    instance: Js2EelCompiler
): string => {
    let functionExpressionSrc = '';

    instance.moveDownInScope((functionExpression as FunctionExpression).id?.name || null);

    const parsedParams: ValidatedParams<ParamName> = {} as ValidatedParams<ParamName>; // FIXME better option?

    if (functionExpression.params.length > paramDefinition.length) {
        instance.error(
            'ParameterError',
            `Function definition: Too many params. Expected ${paramDefinition.length}, got ${functionExpression.params.length}`,
            functionExpression
        );

        return '';
    } else if (functionExpression.params.length < paramDefinition.length) {
        instance.error(
            'ParameterError',
            `Function definition: Too few params. Expected ${paramDefinition.length}, got ${functionExpression.params.length}`,
            functionExpression
        );

        return '';
    }

    for (let i = 0; i < paramDefinition.length; i++) {
        const definedParam = paramDefinition[i];
        const functionParam = functionExpression.params[i];

        parsedParams[definedParam.name] = { scopedValue: null, rawValue: null };

        // Argument amount & type validation is done higher up in the call stack

        let value: string | number | Record<string, string | number>;
        let rawValue: string | null;

        switch (functionParam.type) {
            case 'Identifier': {
                registerDeclarationParam(functionParam, instance);
                value = functionParam.name;
                rawValue = functionParam.name;
                break;
            }
            default: {
                instance.error(
                    'TypeError',
                    `Function definition: Parameter type ${functionParam.type} not allowed. Only identifier is allowed`,
                    functionParam
                );
                value = '';
                rawValue = '';
            }
        }

        parsedParams[definedParam.name] = {
            scopedValue: value,
            rawValue: rawValue
        };
    }

    const body = functionExpression.body;

    switch (parentScopeId) {
        case 'onSlider': {
            switch (body.type) {
                case 'BlockStatement': {
                    functionExpressionSrc += blockStatement(body, 'onSlider', instance);
                    break;
                }
                default: {
                    instance.error(
                        'TypeError',
                        'onSlider(): onSlidersFunction.body.type not allowed',
                        body
                    );
                }
            }

            break;
        }
        case 'eachChannel': {
            let callbackSrc = '\n';

            for (
                let i = 0;
                i < instance.getChannels().inChannels;
                /* FIXME is this sufficient? what about out? */ i++
            ) {
                callbackSrc += `/* Channel ${i} */

${prefixChannel(i)} = ${i};

`;

                instance.setCurrentChannel(i);

                instance.setEachChannelParamMapEntry(
                    'sampleIdentifier',
                    parsedParams['sampleIdentifier' as ParamName].rawValue
                );

                instance.setEachChannelParamMapEntry(
                    'channelIdentifier',
                    parsedParams['channelIdentifier' as ParamName].rawValue
                );

                switch (body.type) {
                    case 'BlockStatement': {
                        if (body.body.length === 0) {
                            callbackSrc = '';

                            break;
                        }

                        callbackSrc += blockStatement(body, 'eachChannel', instance);
                        break;
                    }
                    default: {
                        instance.error(
                            'TypeError',
                            'eachChannel(): callback.body.type not allowed',
                            body
                        );
                    }
                }

                callbackSrc += '\n';
            }

            functionExpressionSrc += callbackSrc;

            break;
        }

        case 'onSample': {
            switch (body.type) {
                case 'BlockStatement': {
                    if (body.body.length === 0) {
                        functionExpressionSrc = '';

                        break;
                    }

                    functionExpressionSrc += blockStatement(body, 'onSample', instance);
                    break;
                }
                default: {
                    instance.error(
                        'TypeError',
                        'onSample(): onSampleFunction.body.type not allowed',
                        body
                    );
                }
            }

            break;
        }

        case 'onInit': {
            switch (body.type) {
                case 'BlockStatement': {
                    functionExpressionSrc += blockStatement(body, 'onInit', instance);
                    break;
                }
                default: {
                    instance.error(
                        'TypeError',
                        `onInit() callback body type ${body.type} not allowed`,
                        body
                    );
                }
            }
            break;
        }
        /* Should be caught further up */
        /* c8 ignore start */
        default: {
            instance.error(
                'GenericError',
                'Function expressions are only allowed as arguments to onInit(), onBlock(), onSample(), eachChannel() and onSlider()',
                functionExpression
            );
        }
        /* c8 ignore stop */
    }

    instance.moveUpInScope();

    return functionExpressionSrc;
};
