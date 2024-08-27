import { functionExpression } from '../../functionExpression/functionExpression.js';
import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';

import type { ArrowFunctionExpression, CallExpression, FunctionExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';

export const onBlock = (callExpression: CallExpression, instance: Js2EelCompiler): string => {
    let onBlockSrc = '';

    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'onBlock() can only be called in the root scope',
            callExpression
        );

        return '';
    }

    if (instance.getUsedStage('onBlock')) {
        instance.error('StageError', 'onBlock() can only be called once', callExpression);

        return '';
    }

    const { args: _args, errors: onBlockErrors } = evaluateLibraryFunctionCall(
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

    if (onBlockErrors) {
        instance.multipleErrors(onBlockErrors);

        return '';
    }

    const callback = callExpression.arguments[0] as ArrowFunctionExpression | FunctionExpression;

    onBlockSrc += functionExpression(callback, [], 'onBlock', instance);

    instance.setUsedStage('onBlock');

    return onBlockSrc;
};
