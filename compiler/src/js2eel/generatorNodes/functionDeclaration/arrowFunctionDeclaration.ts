import { blockStatement } from '../blockStatement/blockStatement.js';

import type { ArrowFunctionExpression, Identifier, VariableDeclaration } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { ArgDefinition, FunctionSymbol } from '../../types.js';
import { validateSymbolName } from '../../validation/validateSymbolName.js';
import Joi from 'joi';
import { getLowerCasedDeclaredSymbol } from '../../environment/getLowerCaseDeclaredSymbol.js';
import { registerDeclarationParam } from '../../declarationParams/registerDeclarationParam.js';

export const arrowFunctionDeclaration = (
    variableDeclaration: VariableDeclaration,
    instance: Js2EelCompiler
): void => {
    const declarationIdentifier = variableDeclaration.declarations[0].id as Identifier;
    const arrowFunctionExpression = variableDeclaration.declarations[0]
        .init as ArrowFunctionExpression;

    // Is caught further up at variableDeclaration()
    /* c8 ignore start */
    if (!arrowFunctionExpression) {
        instance.error(
            'GenericError',
            'Arrow function declaration: no function declaration found',
            variableDeclaration
        );

        return;
    }
    /* c8 ignore stop */

    if (arrowFunctionExpression.body.type !== 'BlockStatement') {
        instance.error(
            'GenericError',
            'Arrow function declaration: body type: Only block statement allowed',
            variableDeclaration
        );

        return;
    }

    instance.moveDownInScope(declarationIdentifier.name);

    // Already-declared-check is done in variableDeclaration()

    // Symbol name check is done in variableDeclaration()

    let eelSrc = '';

    arrowFunctionExpression.params.forEach((param) => {
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
    eelSrc += blockStatement(
        arrowFunctionExpression.body,
        declarationIdentifier.name,
        instance,
        true
    );
    const paramNameSet: Record<string, boolean> = {};
    const argList = arrowFunctionExpression.params.map((param) => (param as Identifier).name);
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
        anonymous: false,
        eelSrc: eelSrc,
        used: false,
        argDefinition: argDefinitions,
        node: arrowFunctionExpression
    };

    instance.setDeclaredSymbol(declarationIdentifier.name, newFunc);
};
