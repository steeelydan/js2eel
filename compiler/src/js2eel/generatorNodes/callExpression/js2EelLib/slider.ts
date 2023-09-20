import Joi from 'joi';

import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';

import type { CallExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type { Slider } from '../../../types.js';

export const slider = (callExpression: CallExpression, instance: Js2EelCompiler): void => {
    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'slider() can only be called in the root scope',
            callExpression
        );

        return;
    }

    const { args, errors } = evaluateLibraryFunctionCall(
        callExpression,
        [
            {
                name: 'sliderNumber',
                required: true,
                allowedValues: [
                    { nodeType: 'Literal', validationSchema: Joi.number().min(1).max(64) }
                ]
            },
            { name: 'variable', required: true, allowedValues: [{ nodeType: 'Identifier' }] },
            {
                name: 'initialValue',
                required: true,
                allowedValues: [
                    { nodeType: 'Literal', validationSchema: Joi.number() },
                    { nodeType: 'UnaryExpression', validationSchema: Joi.number() }
                ]
            },
            {
                name: 'min',
                required: true,
                allowedValues: [
                    { nodeType: 'Literal', validationSchema: Joi.number() },
                    { nodeType: 'UnaryExpression', validationSchema: Joi.number() }
                ]
            },
            {
                name: 'max',
                required: true,
                allowedValues: [
                    { nodeType: 'Literal', validationSchema: Joi.number() },
                    { nodeType: 'UnaryExpression', validationSchema: Joi.number() }
                ]
            },
            {
                name: 'step',
                required: true,
                allowedValues: [
                    { nodeType: 'Literal', validationSchema: Joi.number() },
                    { nodeType: 'UnaryExpression', validationSchema: Joi.number() }
                ]
            },
            {
                name: 'label',
                required: true,
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.string().max(64) }]
            }
        ],
        instance
    );

    if (errors) {
        instance.multipleErrors(errors);

        return;
    }

    if (instance.sliderNumberIsUsed(args.sliderNumber.value)) {
        instance.error(
            'EelConventionError',
            `Error at slider registration: This slider number is already used: ${args.sliderNumber.value}`,
            args.sliderNumber.node
        );

        return;
    }

    const sliderBoundVariable = args.variable.name;

    if (instance.getSlider(sliderBoundVariable) || instance.getSelectBox(sliderBoundVariable)) {
        instance.error(
            'BindingError',
            `Error at slider registration: This variable is already bound to a slider or select box: ${sliderBoundVariable}`,
            args.variable.node
        );

        return;
    }

    const declaredSymbol = instance.getDeclaredSymbolUpInScope(sliderBoundVariable);

    if (
        declaredSymbol &&
        declaredSymbol.symbol.declarationType &&
        declaredSymbol.symbol.declarationType === 'const'
    ) {
        instance.error(
            'GenericError',
            `Cannot bind constant to slider value: ${sliderBoundVariable}`,
            args.variable.node
        );
    }

    instance.setSliderNumber(args.sliderNumber.value);

    const slider: Slider = {
        sliderNumber: args.sliderNumber.value,
        variable: sliderBoundVariable,
        initialValue: args.initialValue.value,
        min: args.min.value,
        max: args.max.value,
        step: args.step.value,
        label: args.label.value
    };

    instance.addSlider(slider);
};
