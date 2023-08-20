import { evaluateLibraryFunctionCall } from '../../callExpression/utils/evaluateLibraryFunctionCall.js';
import type { CallExpression, Identifier, PrivateIdentifier } from 'estree';
import type { Js2EelCompiler } from '../../../index.js';
import Joi from 'joi';

export const mathMemberCall = (
    parentCallExpression: CallExpression,
    calleeProperty: Identifier | PrivateIdentifier,
    instance: Js2EelCompiler
): string => {
    let mathMemberSrc = '';

    switch (calleeProperty.name) {
        case 'pow': {
            const { args, errors } = evaluateLibraryFunctionCall(
                parentCallExpression,
                [
                    {
                        name: 'x',
                        required: true,
                        allowedValues: [
                            {
                                nodeType: 'Literal',
                                validationSchema: Joi.number()
                            },
                            {
                                nodeType: 'UnaryExpression',
                                validationSchema: Joi.number()
                            },
                            {
                                nodeType: 'Identifier'
                            },
                            {
                                nodeType: 'BinaryExpression'
                            }
                        ]
                    },
                    {
                        name: 'y',
                        required: true,
                        allowedValues: [
                            {
                                nodeType: 'Literal',
                                validationSchema: Joi.number()
                            },
                            {
                                nodeType: 'UnaryExpression',
                                validationSchema: Joi.number()
                            },
                            {
                                nodeType: 'Identifier'
                            },
                            {
                                nodeType: 'BinaryExpression'
                            }
                        ]
                    }
                ],
                instance
            );
            if (errors) {
                instance.multipleErrors(errors);
                break;
            }

            mathMemberSrc += `${args.x.value} ^ (${args.y.value})`;

            break;
        }
        default: {
            instance.error(
                'IllegalPropertyError',
                'Math member call: property not allowed: ' + calleeProperty.name,
                parentCallExpression
            );
        }
    }

    return mathMemberSrc;
};
