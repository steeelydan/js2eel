import { identifier } from '../../identifier/identifier.js';
import { unaryExpression } from '../../unaryExpression/unaryExpression.js';

import { validateValue } from '../../../validation/validateValue.js';
import { suffixScopeByScopeSuffix } from '../../../suffixersAndPrefixers/suffixScope.js';

import type { CallExpression } from 'estree';
import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type {
    ArgDefinition,
    EelGeneratorError,
    FunctionAssignment,
    ParsedFunctionArgument,
    ValidatableFunctionCallAllowedValue
} from '../../../types.js';

type ValidatedUserFunctionArgs<ArgName extends string> = {
    [argName in ArgName]: ParsedFunctionArgument;
};

export const evaluateUserFunctionCall = <ArgName extends string>(
    functionCallExpression: CallExpression,
    argDefinition: ArgDefinition<ArgName>[],
    scopeSuffix: number,
    instance: Js2EelCompiler
): {
    args: ValidatedUserFunctionArgs<ArgName>;
    errors: EelGeneratorError[] | null;
} => {
    const parsedArgs: ValidatedUserFunctionArgs<ArgName> = {} as ValidatedUserFunctionArgs<ArgName>;
    const errors: EelGeneratorError[] = [];

    const callee = functionCallExpression.callee;

    /* c8 ignore start */
    // Should not happen (although, when would it even?)
    if (!('name' in callee)) {
        return {
            args: parsedArgs,
            errors: [
                {
                    type: 'TypeError',
                    msg: 'Error evaluating user function: Callee type not allowed:' + callee.type,
                    node: callee
                }
            ]
        };
    }
    /* c8 ignore stop */

    const declaredSymbolEntry = instance.getDeclaredSymbolUpInScope(callee.name);

    /* c8 ignore start */
    // Caught in CallExpression
    if (!declaredSymbolEntry) {
        errors.push({
            type: 'UnknownSymbolError',
            msg: `Unknown symbol ${callee.name}`,
            node: functionCallExpression
        });

        return { args: parsedArgs, errors };
    }
    /* c8 ignore stop */

    if (functionCallExpression.arguments.length > argDefinition.length) {
        errors.push({
            type: 'ArgumentError',
            msg: `${callee.name}: Too many arguments. Expected: ${argDefinition.length}, given: ${functionCallExpression.arguments.length}`,
            node: functionCallExpression
        });
    }

    for (let i = 0; i < argDefinition.length; i++) {
        const definedArg = argDefinition[i];
        const givenArg = functionCallExpression.arguments[i];

        if (definedArg.required) {
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
                type: 'ArgumentError',
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

        switch (givenArg.type) {
            case 'Literal': {
                value = givenArg.value as string | number;
                /* c8 ignore next */
                rawValue = givenArg.raw || '';
                break;
            }
            case 'Identifier': {
                const id = identifier(givenArg, instance);
                value = id;
                rawValue = id;
                break;
            }
            case 'UnaryExpression': {
                const un = unaryExpression(givenArg, instance);
                value = parseFloat(un);
                rawValue = un;
                break;
            }
            /* c8 ignore start */
            default: {
                // Is caught by allowedValue type check
                errors.push({
                    type: 'TypeError',
                    msg: `${callee.name}: Argument type ${givenArg.type} not allowed`,
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
            givenArg.type === 'UnaryExpression'
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
            scopedName: suffixScopeByScopeSuffix(
                definedArg.name,
                (declaredSymbolEntry.symbol.currentAssignment as FunctionAssignment).ownScopeSuffix
            ),
            value: value,
            node: givenArg
        };
    }

    return { args: parsedArgs, errors: errors.length ? errors : null };
};
