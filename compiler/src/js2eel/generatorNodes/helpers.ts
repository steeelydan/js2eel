import Joi from 'joi';

import type { FunctionCallAllowedValues } from '../types';

export const defaultNumericArgAllowedValues: FunctionCallAllowedValues = [
    { nodeType: 'Literal', validationSchema: Joi.number() },
    { nodeType: 'Identifier' },
    { nodeType: 'BinaryExpression' },
    { nodeType: 'UnaryExpression', validationSchema: Joi.number() },
    { nodeType: 'CallExpression' },
    { nodeType: 'MemberExpression' }
];
