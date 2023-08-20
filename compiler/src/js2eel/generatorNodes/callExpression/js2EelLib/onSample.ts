import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';
import { functionExpression } from '../../functionExpression/functionExpression.js';

import type { ArrowFunctionExpression, CallExpression, FunctionExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';

export const onSample = (callExpression: CallExpression, instance: Js2EelCompiler): string => {
    let onSampleSrc = '';

    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'onSample() can only be called in the root scope',
            callExpression
        );

        return '';
    }

    if (instance.getUsedStage('onSample')) {
        instance.error('StageError', 'onSample() can only be called once', callExpression);

        return '';
    }

    const { args: _args, errors: onSampleErrors } = evaluateLibraryFunctionCall(
        callExpression,
        [
            {
                name: 'callback',
                required: true,
                allowedValues: [
                    { nodeType: 'FunctionExpression' },
                    { nodeType: 'ArrowFunctionExpression' }
                ]
            }
        ],
        instance
    );

    if (onSampleErrors) {
        instance.multipleErrors(onSampleErrors);

        return '';
    }

    const callback = callExpression.arguments[0] as ArrowFunctionExpression | FunctionExpression;

    onSampleSrc += functionExpression(callback, [], 'onSample', instance);

    instance.setUsedStage('onSample');

    return onSampleSrc;
};
