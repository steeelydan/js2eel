import { blockStatement } from '../blockStatement/blockStatement.js';

import type { FunctionDeclaration, Identifier } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { ArgDefinition, FunctionSymbol } from '../../types.js';
import { validateSymbolName } from '../../validation/validateSymbolName.js';
import Joi from 'joi';
import { getLowerCasedDeclaredSymbol } from '../../environment/getLowerCaseDeclaredSymbol.js';
import { registerDeclarationParam } from '../../declarationParams/registerDeclarationParam.js';

export const functionDeclaration = (
    functionDeclaration: FunctionDeclaration,
    instance: Js2EelCompiler
): void => {
    const declarationIdentifier = functionDeclaration.id;

    const anonymous = !declarationIdentifier;

    // Can only be anonymous if it's a function expression, and those are not allowed in the places where declarations are allowed.
    /* c8 ignore start */
    if (anonymous) {
        instance.error('GenericError', 'Anonymous functions are not allowed', functionDeclaration);

        return;
    }
    /* c8 ignore stop */

    instance.moveDownInScope(declarationIdentifier.name);

    // Normally the parser would check if symbol is already declared, but we have to do it
    // manually because EEL is not case-sensitive.

    if (getLowerCasedDeclaredSymbol(declarationIdentifier.name.toLowerCase(), instance)) {
        instance.error(
            'ScopeError',
            `Symbol already declared: ${declarationIdentifier.name}. Keep in mind EEL is case-insensitive.`,
            declarationIdentifier
        );

        return;
    }

    const { errors } = validateSymbolName(declarationIdentifier.name);

    if (errors.length > 0) {
        instance.multipleErrors(
            errors.map((error) => ({
                type: 'ValidationError',
                msg: error,
                node: declarationIdentifier
            }))
        );

        return;
    }

    let eelSrc = '';

    functionDeclaration.params.forEach((param) => {
        switch (param.type) {
            case 'Identifier': {
                registerDeclarationParam(param, instance);
                break;
            }
            default: {
                instance.error(
                    'TypeError',
                    `Function declaration ${declarationIdentifier.name}: param type not allowed: ${param.type}`,
                    param
                );
            }
        }
    });

    // Body type can only be block statement at this point.
    eelSrc += blockStatement(functionDeclaration.body, declarationIdentifier.name, instance, true);
    const paramNameSet: Record<string, boolean> = {};
    const argList = functionDeclaration.params.map((param) => (param as Identifier).name);
    argList.forEach((name) => (paramNameSet[name] = true));

    const argDefinitions: ArgDefinition<(typeof argList)[number]>[] = [];
    argList.forEach((name) =>
        argDefinitions.push({
            name: name,
            allowedValues: [
                { nodeType: 'Identifier' },
                {
                    nodeType: 'Literal',
                    validationSchema: Joi.alternatives(Joi.number(), Joi.string())
                },
                { nodeType: 'UnaryExpression', validationSchema: Joi.number() }
            ],
            required: true
        })
    );

    const ownScopePath = instance.getCurrentScopePath();
    const ownScopeSuffix = instance.getCurrentScopeSuffix();

    instance.moveUpInScope();

    const newFunc: FunctionSymbol = {
        type: 'function',
        inScopePath: instance.getCurrentScopePath(),
        ownScopePath: ownScopePath,
        inScopeSuffix: instance.getCurrentScopeSuffix(),
        ownScopeSuffix: ownScopeSuffix,
        anonymous: anonymous,
        eelSrc: eelSrc,
        used: false,
        argDefinition: argDefinitions,
        node: functionDeclaration
    };

    instance.setDeclaredSymbol(declarationIdentifier.name, newFunc);
};
