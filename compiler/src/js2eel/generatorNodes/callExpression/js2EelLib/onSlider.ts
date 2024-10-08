import { functionExpression } from '../../functionExpression/functionExpression.js';

import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';

import type { ArrowFunctionExpression, CallExpression, FunctionExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';

export const onSlider = (callExpression: CallExpression, instance: Js2EelCompiler): string => {
    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'onSlider() can only be called in the root scope',
            callExpression
        );

        return '';
    }

    if (instance.getUsedStage('onSlider')) {
        instance.error('StageError', 'onSlider() can only be called once', callExpression);

        return '';
    }

    const { args: _onSliderArgs, errors: onSliderErrors } = evaluateLibraryFunctionCall(
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

    if (onSliderErrors) {
        instance.multipleErrors(onSliderErrors);

        return '';
    }

    const callback = callExpression.arguments[0] as FunctionExpression | ArrowFunctionExpression;

    const onSlidersCallbackSrc = functionExpression(callback, [], 'onSlider', instance);

    let onSlidersSrc = ``;

    if (onSlidersCallbackSrc) {
        onSlidersSrc += '@slider\n\n';

        const fileSelectors = instance.getFileSelectors();

        if (Object.entries(fileSelectors).length) {
            for (const fileSelector of Object.values(fileSelectors)) {
                onSlidersSrc += `${fileSelector.variable} = slider${fileSelector.sliderNumber};`;
            }

            onSlidersSrc += '\n\n';
        }

        onSlidersSrc += onSlidersCallbackSrc;
        onSlidersSrc += '\n\n';
    }

    instance.setUsedStage('onSlider');

    return onSlidersSrc;
};
