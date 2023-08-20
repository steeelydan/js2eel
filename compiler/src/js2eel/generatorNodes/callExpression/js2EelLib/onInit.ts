import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';
import { functionExpression } from '../../functionExpression/functionExpression.js';

import type { ArrowFunctionExpression, CallExpression, FunctionExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';

export const onInit = (callExpression: CallExpression, instance: Js2EelCompiler): string => {
    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'onInit() can only be called in the root scope',
            callExpression
        );

        return '';
    }

    if (instance.getUsedStage('onInit')) {
        instance.error('StageError', 'onInit() can only be called once', callExpression);

        return '';
    }

    const { args: _args, errors: onInitErrors } = evaluateLibraryFunctionCall(
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

    if (onInitErrors) {
        instance.multipleErrors(onInitErrors);

        return '';
    }

    const callback = callExpression.arguments[0] as FunctionExpression | ArrowFunctionExpression;

    let onInitSrc = '';

    onInitSrc += functionExpression(callback, [], 'onInit', instance);

    instance.setUsedStage('onInit');

    return onInitSrc;
};
