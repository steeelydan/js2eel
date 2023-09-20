import Joi from 'joi';

import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import type { ObjectExpression } from 'estree';

export const objectExpression = (
    objectExpression: ObjectExpression,
    instance: Js2EelCompiler
): { stringValue: string; objectValue: Record<string, unknown> } => {
    console.log('objectExpression', objectExpression);

    const validationSchema = Joi.object().pattern(
        /\w/,
        Joi.alternatives(Joi.string(), Joi.number())
    );

    const validationResult = validationSchema.validate(objectExpression);

    return { stringValue: 'OBJECT', objectValue: { prop: 'someProp' } };
};
