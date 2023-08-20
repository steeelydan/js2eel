import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';
import { functionExpression } from '../../functionExpression/functionExpression.js';

import type { ArrowFunctionExpression, CallExpression, FunctionExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';

export const eachChannel = (callExpression: CallExpression, instance: Js2EelCompiler): string => {
    const scopePath = instance.getCurrentScopePath();
    const scopedEnvironment = instance.getScopeEntry(scopePath);

    if (!scopedEnvironment || scopedEnvironment.scopeId !== 'onSample') {
        instance.error(
            'ScopeError',
            'eachChannel() can only be called in onSample()',
            callExpression
        );

        return '';
    }

    let eachChannelSrc = '';

    const { args: eachChannelArgs, errors: eachChannelErrors } = evaluateLibraryFunctionCall(
        callExpression,
        [
            {
                name: 'callback',
                required: true,
                allowedValues: [
                    { nodeType: 'ArrowFunctionExpression' },
                    { nodeType: 'FunctionExpression' }
                ]
            }
        ],
        instance
    );

    if (eachChannelErrors) {
        instance.multipleErrors(eachChannelErrors);

        return '';
    }

    const callback = eachChannelArgs.callback.node as FunctionExpression | ArrowFunctionExpression;

    eachChannelSrc += functionExpression(
        callback,
        [
            {
                name: 'sampleIdentifier',
                required: true,
                allowedValues: [{ nodeType: 'Identifier' }]
            },
            {
                name: 'channelIdentifier',
                required: true,
                allowedValues: [{ nodeType: 'Identifier' }]
            }
        ],
        'eachChannel',
        instance
    );


    return eachChannelSrc;
};
