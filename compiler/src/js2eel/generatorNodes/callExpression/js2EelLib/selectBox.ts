import Joi from 'joi';

import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';

import type { CallExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type { SelectBox } from '../../../types.js';

export const selectBox = (callExpression: CallExpression, instance: Js2EelCompiler): void => {
    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'selectBox() can only be called in the root scope',
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
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.string() }]
            },
            {
                name: 'values',
                required: true,
                allowedValues: [
                    {
                        nodeType: 'ArrayExpression',
                        validationSchema: Joi.array().items(
                            Joi.object({
                                name: Joi.string().required().max(64),
                                label: Joi.string().required().max(64)
                            })
                        )
                    }
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

    const selectBoxBoundVariable = args.variable.name;

    if (
        instance.getSlider(selectBoxBoundVariable) ||
        instance.getSelectBox(selectBoxBoundVariable)
    ) {
        instance.error(
            'BindingError',
            `Error at select box registration: This variable is already bound to a slider or select box: ${selectBoxBoundVariable}`,
            args.variable.node
        );

        return;
    }

    if (
        args.values.value.length &&
        !args.values.value.find(
            (valueObj: { name: string; label: string }) => valueObj.name === args.initialValue.value
        )
    ) {
        instance.error(
            'ParameterError',
            `Error at selectBox registration: The initial value must be one of the values: ${args.values.value
                .map((value: any) => value.name)
                .join(', ')}`,
            callExpression.arguments[1]
        );

        return;
    }

    instance.setSliderNumber(args.sliderNumber.value);

    const selectBox: SelectBox = {
        sliderNumber: args.sliderNumber.value,
        variable: selectBoxBoundVariable,
        initialValue: args.initialValue.value,
        label: args.label.value,
        values: args.values.value
    };

    instance.addSelectBox(selectBox);
};
