import type Joi from 'joi';

import type { Node } from 'estree';
import type { EelGeneratorError } from '../types.js';

export const validateValue = (
    node: Node,
    value: unknown,
    schema: Joi.Schema
): { errors: EelGeneratorError[] | null } => {
    const result = schema.validate(value, { abortEarly: true });

    if (result.error) {
        return {
            errors: [
                {
                    type: 'ValidationError',
                    msg: result.error.message,
                    node
                }
            ]
        };
    }

    return { errors: null };
};
