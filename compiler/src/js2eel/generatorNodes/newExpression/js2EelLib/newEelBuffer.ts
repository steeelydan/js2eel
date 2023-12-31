import Joi from 'joi';
import { evaluateLibraryFunctionCall } from '../../callExpression/utils/evaluateLibraryFunctionCall';

import type { NewExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import type { EelBuffer } from '../../../types';

export const newEelBuffer = (
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
                allowedValues: [{ nodeType: 'Literal', validationSchema: Joi.number().min(1).max(64) }]
            },
            {
                name: 'size',
                required: true,
                allowedValues: [
                    { nodeType: 'Literal', validationSchema: Joi.number().min(1).max(8000000) },
                    { nodeType: 'Identifier' }
                ]
            }
        ],
        instance
    );

    if (errors) {
        instance.multipleErrors(errors);

        return;
    } else {
        const newEelBuffer: EelBuffer = {
            name: symbolName,
            dimensions: args.dimensions.value,
            sizeSrc: args.size.value
        };

        instance.setEelBuffer(newEelBuffer);
    }
};
