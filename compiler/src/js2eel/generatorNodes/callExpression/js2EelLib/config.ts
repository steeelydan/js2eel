import Joi from 'joi';

import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';

import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type { CallExpression } from 'estree';

export const config = (callExpression: CallExpression, instance: Js2EelCompiler): void => {
    if (instance.getCurrentScopePath() !== 'root') {
        instance.error(
            'ScopeError',
            'config() can only be called in the root scope',
            callExpression
        );

        return;
    }

    if (instance.getDescription()) {
        instance.error('StageError', 'config() can only be called once', callExpression);

        return;
    }

    const { args, errors } = evaluateLibraryFunctionCall(
        callExpression,
        [
            {
                name: 'configObject',
                required: true,
                allowedValues: [
                    {
                        nodeType: 'ObjectExpression',
                        validationSchema: Joi.object({
                            description: Joi.string().required().max(64),
                            inChannels: Joi.number().min(1).max(64).required(),
                            outChannels: Joi.number().min(1).max(64).required(),
                            extTailSize: Joi.number().min(-2).optional()
                        })
                    }
                ]
            }
        ],
        instance
    );

    if (errors) {
        instance.multipleErrors(errors);

        return;
    }

    const configObject = args.configObject.value;
    if (configObject) {
        instance.setDescription(configObject.description);
        instance.setName(configObject.description);
        instance.setChannels(configObject.inChannels, configObject.outChannels);
        if (configObject.extTailSize !== null && configObject.extTailSize !== undefined) {
            instance.setExtTailSize(configObject.extTailSize);
        }
    }
};
