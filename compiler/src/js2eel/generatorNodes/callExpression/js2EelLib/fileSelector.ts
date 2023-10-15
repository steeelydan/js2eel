import Joi from 'joi';

import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';

import type { CallExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type { FileSelector } from '../../../types.js';

export const fileSelector = (callExpression: CallExpression, instance: Js2EelCompiler): void => {
    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'fileSelector() can only be called in the root scope',
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
            {
                name: 'id',
                required: true,
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.string().max(64) }]
            },
            {
                name: 'path',
                required: true,
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.string().max(64) }]
            },
            {
                name: 'defaultValue',
                required: true,
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.string().max(64) }]
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
            `Error at file selector registration: This slider number is already used: ${args.sliderNumber.value}`,
            args.sliderNumber.node
        );

        return;
    }

    if (instance.getFileSelector(args.id.value)) {
        instance.error(
            'EelConventionError',
            `Error at file selector registration: A file selector with this ID is already registered: ${args.id.value}`,
            args.id.node
        );

        return;
    }

    instance.setSliderNumber(args.sliderNumber.value);

    const fileSelector: FileSelector = {
        sliderNumber: args.sliderNumber.value,
        id: args.id.value,
        path: args.path.value,
        defaultValue: args.defaultValue.value,
        label: args.label.value
    };

    instance.addFileSelector(fileSelector);
};