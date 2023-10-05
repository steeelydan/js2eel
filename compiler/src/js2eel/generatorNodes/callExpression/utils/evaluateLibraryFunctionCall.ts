import { identifier } from '../../identifier/identifier.js';
import { unaryExpression } from '../../unaryExpression/unaryExpression.js';
import { binaryExpression } from '../../binaryExpression/binaryExpression.js';
import { arrayExpression } from '../../arrayExpression/arrayExpression.js';
import { callExpression } from '../callExpression.js';

import { validateValue } from '../../../validation/validateValue.js';

import type { CallExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type {
    ArgDefinition,
    EelGeneratorError,
    ParsedFunctionArgument,
    ValidatableFunctionCallAllowedValue
} from '../../../types.js';
import { memberExpression } from '../../memberExpression/memberExpression.js';

type ValidatedArgs<ArgName extends string> = {
    [argName in ArgName]: ParsedFunctionArgument;
};

export const evaluateLibraryFunctionCall = <ArgName extends string>(
    functionCallExpression: CallExpression,
    argDefinition: ArgDefinition<ArgName>[],
    instance: Js2EelCompiler
): {
    args: ValidatedArgs<ArgName>;
    errors: EelGeneratorError[] | null;
} => {
    let requiredAmount = 0;
    const parsedArgs: ValidatedArgs<ArgName> = {} as ValidatedArgs<ArgName>; // FIXME better option
    const errors: EelGeneratorError[] = [];

    let callee = functionCallExpression.callee;
    const givenArgs = functionCallExpression.arguments;

    if (callee.type === 'MemberExpression') {
        if ('property' in callee && callee.property.type === 'Identifier') {
            // We're calling the property of a MemberExpression
            callee = callee.property;
            /* c8 ignore start */
            // Not sure how we would test this
        } else {
            const error: EelGeneratorError = {
                type: 'GenericError',
                msg: 'Something is wrong in the property of the MemberExpression',
                node: callee
            };

            return { args: parsedArgs, errors: [error] };
        }
        /* c8 ignore stop */
    }

    /* c8 ignore start */
    // Not sure how we would test this

    if (!('name' in callee)) {
        return {
            args: parsedArgs,
            errors: [
                ...errors,
                {
                    type: 'TypeError',
                    msg:
                        'Library Function CallExpression: CallExpression is of the wrong type: ' +
                        functionCallExpression.type,
                    node: functionCallExpression
                }
            ]
        };
    }
    /* c8 ignore stop */

    if (givenArgs.length > argDefinition.length) {
        errors.push({
            type: 'ArgumentError',
            msg: `${callee.name}: Too many arguments given: ${givenArgs.length}. Allowed: ${argDefinition.length}`,
            node: functionCallExpression
        });
    }

    for (let i = 0; i < argDefinition.length; i++) {
        const definedArg = argDefinition[i];
        const givenArg = givenArgs[i];

        /* c8 ignore start */
        if (!definedArg) {
            throw new Error("Shouldn't happen");
        }
        /* c8 ignore stop */

        if (definedArg.required) {
            requiredAmount++;

            if (!givenArg) {
                errors.push({
                    type: 'ArgumentError',
                    msg: `${callee.name}: Argument required in position ${i + 1}: ${
                        definedArg.name
                    }`,
                    node: functionCallExpression
                });

                continue;
            }
        }

        const allowedValue = definedArg.allowedValues.find(
            (allowedValue) => givenArg.type === allowedValue.nodeType
        );

        if (!allowedValue) {
            errors.push({
                type: 'TypeError',
                msg: `${callee.name}: Argument type ${
                    givenArg.type
                } not allowed. Allowed: ${definedArg.allowedValues
                    .map((allowedValue) => allowedValue.nodeType)
                    .join(', ')}`,
                node: functionCallExpression
            });

            continue;
        }

        let value: unknown;
        let rawValue: string | null;

        // FIXME Separate validatable and non-validatable types

        switch (givenArg.type) {
            case 'Literal': {
                value = givenArg.value as string | number;
                /* c8 ignore next */
                rawValue = givenArg.raw || '';
                break;
            }
            case 'UnaryExpression': {
                const un = unaryExpression(givenArg, instance);
                value = parseFloat(un);
                rawValue = un;
                break;
            }
            case 'ObjectExpression': {
                const ourObject: Record<string, string | number> = {};
                for (let i = 0; i < givenArg.properties.length; i++) {
                    const prop = givenArg.properties[i];

                    if (
                        prop.type === 'Property' &&
                        prop.key.type === 'Identifier' &&
                        typeof prop.key.name === 'string' &&
                        prop.value.type === 'Literal' &&
                        (typeof prop.value.value === 'string' ||
                            typeof prop.value.value === 'number')
                    ) {
                        ourObject[prop.key.name] = prop.value.value;
                    }
                }
                value = ourObject;
                rawValue = JSON.stringify(ourObject);
                break;
            }
            case 'Identifier': {
                const id = identifier(givenArg, instance);
                value = id;
                rawValue = id;
                break;
            }
            case 'BinaryExpression': {
                const bin = binaryExpression(givenArg, instance);
                value = bin;
                rawValue = bin;
                break;
            }
            case 'ArrowFunctionExpression': {
                value = '';
                rawValue = '';
                break;
            }
            case 'FunctionExpression': {
                value = '';
                rawValue = '';
                break;
            }
            case 'ArrayExpression': {
                const arrayExpVal = arrayExpression(givenArg, instance);

                value = arrayExpVal;
                rawValue = givenArg.elements.toString();

                break;
            }
            case 'CallExpression': {
                const callExpVal = callExpression(givenArg, instance);

                value = callExpVal;
                rawValue = callExpVal;

                break;
            }
            case 'MemberExpression': {
                value = '';
                rawValue = '';

                break;
            }
            // FIXME: Should be caught further up at arg validation
            /* c8 ignore start */
            default: {
                errors.push({
                    type: 'TypeError',
                    msg: `evaluateLibraryFunctionCall(): ${callee.name}: argument type ${givenArg.type} not allowed`,
                    node: functionCallExpression
                });
                value = '';
                rawValue = '';
            }
            /* c8 ignore stop */
        }

        if (
            givenArg.type === 'Literal' ||
            givenArg.type === 'ObjectExpression' ||
            givenArg.type === 'ArrayExpression' ||
            (givenArg.type === 'UnaryExpression' && typeof value === 'number' && !isNaN(value))
            // FIXME -"someString" would be allowed and give NaN
        ) {
            const { errors: validationErrors } = validateValue(
                givenArg,
                value,
                (allowedValue as ValidatableFunctionCallAllowedValue).validationSchema
            );

            if (validationErrors) {
                errors.push(...validationErrors);

                continue;
            }
        }

        parsedArgs[definedArg.name] = {
            name: 'name' in givenArg ? givenArg.name : definedArg.name,
            scopedName: 'name' in givenArg ? givenArg.name : definedArg.name,
            value: value,
            node: givenArg
        };
    }

    if (givenArgs.length < requiredAmount) {
        errors.push({
            type: 'ArgumentError',
            msg: `${callee.name}: Too few arguments given: ${givenArgs.length}. Required: ${requiredAmount}`,
            node: functionCallExpression
        });
    }

    return { args: parsedArgs, errors: errors.length ? errors : null };
};
