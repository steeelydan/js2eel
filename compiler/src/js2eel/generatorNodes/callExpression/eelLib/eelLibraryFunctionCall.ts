import Joi from 'joi';

import { literal } from '../../literal/literal.js';
import { identifier } from '../../identifier/identifier.js';
import { unaryExpression } from '../../unaryExpression/unaryExpression.js';
import { binaryExpression } from '../../binaryExpression/binaryExpression.js';
import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';

import type { CallExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type { EelGeneratorError, FunctionCallAllowedValues } from '../../../types.js';

const defaultNumericArgAllowedValues: FunctionCallAllowedValues = [
    { nodeType: 'Literal', validationSchema: Joi.number() },
    { nodeType: 'Identifier' },
    { nodeType: 'BinaryExpression' },
    { nodeType: 'UnaryExpression', validationSchema: Joi.number() }
];

export const eelLibraryFunctionCall = (
    callExpression: CallExpression,
    instance: Js2EelCompiler
): string => {
    let argsSrc = '';

    const callee = callExpression.callee;

    /* c8 ignore start */
    // FIXME don't know how to test that
    if (!('name' in callee)) {
        instance.error('TypeError', `Callee type ${callee.type} not allowed`, callee);

        return '';
    }

    let evaluationErrors: EelGeneratorError[] | null = null;

    switch (callee.name) {
        // Accessor functions
        // Slider: realized in libraryFunctionNode
        case 'spl': {
            const { errors } = evaluateLibraryFunctionCall(
                callExpression,
                [
                    {
                        name: 'x',
                        required: true,
                        allowedValues: [
                            {
                                nodeType: 'Literal',
                                validationSchema: Joi.number().min(0).max(63)
                            },
                            { nodeType: 'Identifier' }
                        ]
                    }
                ],
                instance
            );

            evaluationErrors = errors;

            break;
        }

        // Math functions
        // https://www.reaper.fm/sdk/js/basiccode.php#js_basicfunc
        case 'sin':
        case 'cos':
        case 'tan': {
            const { errors } = evaluateLibraryFunctionCall(
                callExpression,
                [
                    {
                        name: 'angle',
                        required: true,
                        allowedValues: defaultNumericArgAllowedValues
                    }
                ],
                instance
            );

            evaluationErrors = errors;

            break;
        }
        case 'asin':
        case 'acos':
        case 'atan':
        case 'sqr':
        case 'sqrt':
        case 'exp':
        case 'log':
        case 'log10':
        case 'abs':
        case 'sign':
        case 'rand':
        case 'floor':
        case 'ceil':
        case 'invsqrt': {
            const { errors } = evaluateLibraryFunctionCall(
                callExpression,
                [
                    {
                        name: 'x',
                        required: true,
                        allowedValues: defaultNumericArgAllowedValues
                    }
                ],
                instance
            );

            evaluationErrors = errors;

            break;
        }
        case 'atan2':
        case 'pow':
        case 'min':
        case 'max': {
            const { errors } = evaluateLibraryFunctionCall(
                callExpression,
                [
                    {
                        name: 'x',
                        required: true,
                        allowedValues: defaultNumericArgAllowedValues
                    },
                    {
                        name: 'y',
                        required: true,
                        allowedValues: defaultNumericArgAllowedValues
                    }
                ],
                instance
            );

            evaluationErrors = errors;

            break;
        }

        default: {
            //
        }
    }

    if (evaluationErrors) {
        instance.multipleErrors(evaluationErrors);

        return '';
    }

    for (let i = 0; i < callExpression.arguments.length; i++) {
        const arg = callExpression.arguments[i];

        switch (arg.type) {
            case 'Identifier': {
                argsSrc += identifier(arg, instance);
                break;
            }
            case 'BinaryExpression': {
                argsSrc += binaryExpression(arg, instance);
                break;
            }
            case 'Literal': {
                argsSrc += literal(arg, instance);
                break;
            }
            case 'UnaryExpression': {
                argsSrc += unaryExpression(arg, instance);
                break;
            }
            default: {
                instance.error('TypeError', `Argument type ${arg.type} not allowed`, arg);
            }
        }

        if (i < callExpression.arguments.length - 1) {
            argsSrc += ', ';
        }
    }

    let functionSrc = '';

    if (callee.name === 'spl' && callExpression.arguments[0].type === 'Literal') {
        // FIXME this is not ideal
        functionSrc = `spl${callExpression.arguments[0].value}`;
    } else {
        functionSrc = `${callee.name}(${argsSrc})`;
    }

    return functionSrc;
};
