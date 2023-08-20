import Joi from 'joi';
import { evaluateLibraryFunctionCall } from '../../callExpression/utils/evaluateLibraryFunctionCall';

import type { NewExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import type { EelArray } from '../../../types';

export const newEelArray = (
    newExpression: NewExpression,
    symbolName: string,
    instance: Js2EelCompiler
): void => {
    const { args, errors } = evaluateLibraryFunctionCall(
        newExpression,
        [
            {
                name: 'dimensions',
                required: true,
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.number().min(1).max(16) }]
            },
            {
                name: 'size',
                required: true,
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.number().min(1).max(16) }]
            }
        ],
        instance
    );

    if (errors) {
        instance.multipleErrors(errors);

        return;
    } else {
        const newEelArray: EelArray = {
            name: symbolName,
            dimensions: args.dimensions.value,
            size: args.size.value
        };

        instance.setEelArray(newEelArray);
    }
};
