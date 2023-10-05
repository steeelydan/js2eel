import { literal } from '../literal/literal.js';
import { identifier } from '../identifier/identifier.js';
import { unaryExpression } from '../unaryExpression/unaryExpression.js';
import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { conditionalExpression } from '../conditionalExpression/conditionalExpression.js';
import { newExpression } from '../newExpression/newExpression.js';
import { callExpression } from '../callExpression/callExpression.js';
import { memberExpression } from '../memberExpression/memberExpression.js';
import { objectExpression } from '../objectExpression/objectExpression.js';
import { arrowFunctionDeclaration } from '../functionDeclaration/arrowFunctionDeclaration.js';

import { suffixScopeBySymbol } from '../../suffixersAndPrefixers/suffixScope.js';
import { addSemicolonIfNone } from '../../suffixersAndPrefixers/addSemicolonIfNone.js';
import { validateSymbolName } from '../../validation/validateSymbolName.js';
import { getLowerCasedDeclaredSymbol } from '../../environment/getLowerCaseDeclaredSymbol.js';
import { ALL_RESERVED_SYMBOL_NAMES, EEL_LIBRARY_VARS } from '../../constants.js';

import type { Identifier, VariableDeclaration } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { AllowedDeclarationType, DeclaredSymbol, ObjectRepresentation } from '../../types.js';

export const variableDeclaration = (
    declaration: VariableDeclaration,
    instance: Js2EelCompiler
): string => {
    let declarationSrc = '';

    let putInInit = false;
    let doNotPrint = false;
    let objectData: { objectRepresentation: ObjectRepresentation; eelSrc: string } | null = null;

    let isArrowFunctionDeclaration = false;

    // Because we inline user functions, we have to compose the compiled src from parts
    // let userFunctionBodySrc = '';
    // let userFunctionReturnSrc = '';
    let leftSideSrc = '';
    let operatorSrc = '';
    let rightSideSrc = '';

    instance.startCurrentInlineData();

    if (declaration.kind === 'var') {
        instance.error(
            'KeywordError',
            'Variable declaration: Only "const" and "let" are allowed.',
            declaration
        );

        return declarationSrc;
    }

    if (declaration.declarations.length !== 1) {
        instance.error(
            'GenericError',
            'Variable declaration: You can only declare 1 variable per line.',
            declaration
        );

        return declarationSrc;
    }

    const onlyDeclaration = declaration.declarations[0];

    // Left side

    switch (onlyDeclaration.id.type) {
        case 'Identifier': {
            if (EEL_LIBRARY_VARS.has(onlyDeclaration.id.name.toLowerCase())) {
                // We can lowercase here because there's only lowercase symbols in EEL
                instance.error(
                    'ScopeError',
                    `${onlyDeclaration.id.name} is a reserved name. Keep in mind EEL is case-insensitive.`,
                    onlyDeclaration.id
                );

                return declarationSrc;
            }

            const { errors } = validateSymbolName(onlyDeclaration.id.name);

            if (errors.length) {
                instance.multipleErrors(
                    errors.map((error) => ({
                        type: 'ValidationError',
                        msg: error,
                        node: onlyDeclaration.id
                    }))
                );

                break;
            }

            // Normally the parser would check if symbol is already declared, but we have to do it
            // manually because EEL is not case-sensitive.

            if (getLowerCasedDeclaredSymbol(onlyDeclaration.id.name.toLowerCase(), instance)) {
                instance.error(
                    'ScopeError',
                    `Symbol already declared: ${onlyDeclaration.id.name}. Keep in mind EEL is case-insensitive.`,
                    onlyDeclaration.id
                );

                return '';
            }

            if (ALL_RESERVED_SYMBOL_NAMES.has(onlyDeclaration.id.name)) {
                instance.error(
                    'SymbolAlreadyDeclaredError',
                    'Symbol name is reserved library symbol name: ' + onlyDeclaration.id.name,
                    onlyDeclaration.id
                );

                return '';
            }

            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Type ${onlyDeclaration.id.type} not allowed for left side`,
                onlyDeclaration.id
            );

            return declarationSrc;
        }
    }

    // Right side

    if (!onlyDeclaration.init) {
        // Declarations without init value
        // Do not need to be initialized in EEL
        doNotPrint = true;
    } else {
        // Only exists when we have the init part of a declaration
        operatorSrc += ' = ';

        switch (onlyDeclaration.init.type) {
            case 'Literal': {
                rightSideSrc += literal(onlyDeclaration.init, instance);

                // Move up to init stage if in root scope
                if (instance.getCurrentScopePath() === 'root') {
                    putInInit = true;
                    doNotPrint = true;
                }
                break;
            }
            case 'UnaryExpression': {
                rightSideSrc += unaryExpression(onlyDeclaration.init, instance);

                // Move up to init stage if in root scope
                if (instance.getCurrentScopePath() === 'root') {
                    putInInit = true;
                    doNotPrint = true;
                }

                break;
            }
            case 'Identifier': {
                rightSideSrc += identifier(onlyDeclaration.init, instance);

                // Move up to init stage if in root scope
                if (instance.getCurrentScopePath() === 'root') {
                    putInInit = true;
                    doNotPrint = true;
                }

                break;
            }
            case 'BinaryExpression': {
                rightSideSrc += binaryExpression(onlyDeclaration.init, instance);

                // Move up to init stage if in root scope
                if (instance.getCurrentScopePath() === 'root') {
                    putInInit = true;
                    doNotPrint = true;
                }

                break;
            }
            case 'ArrowFunctionExpression': {
                arrowFunctionDeclaration(declaration, instance);

                doNotPrint = true;
                isArrowFunctionDeclaration = true;

                break;
            }
            case 'NewExpression': {
                // Only happens for EelBuffers and EelArrays which we collect at the top
                // of the file. So we don't return compiled src here.

                newExpression(
                    onlyDeclaration.init,
                    (onlyDeclaration.id as Identifier).name,
                    instance
                );

                // Gets printed at the end
                doNotPrint = true;

                break;
            }
            case 'CallExpression': {
                const callExpressionSrc = callExpression(onlyDeclaration.init, instance);

                rightSideSrc += callExpressionSrc;

                break;
            }
            case 'MemberExpression': {
                rightSideSrc += memberExpression(onlyDeclaration, onlyDeclaration.init, instance);
                break;
            }
            case 'ObjectExpression': {
                if (instance.getCurrentScopePath() === 'root') {
                    putInInit = true;
                    doNotPrint = true;
                }

                const object = objectExpression(onlyDeclaration.id, onlyDeclaration.init, instance);

                if (!object) {
                    return '';
                }

                objectData = object;

                declarationSrc += object.eelSrc;

                break;
            }
            case 'ConditionalExpression': {
                rightSideSrc += conditionalExpression(onlyDeclaration.init, instance);
                break;
            }
            default: {
                instance.error(
                    'TypeError',
                    `Type ${onlyDeclaration.init.type} not allowed`,
                    onlyDeclaration.init
                );
            }
        }
    }

    if (isArrowFunctionDeclaration) {
        return '';
    }

    if (objectData) {
        const newDeclaredSymbol: DeclaredSymbol = {
            used: false,
            declarationType: declaration.kind as AllowedDeclarationType,
            inScopePath: instance.getCurrentScopePath(),
            inScopeSuffix: instance.getCurrentScopeSuffix(),
            name: onlyDeclaration.id.name,
            node: onlyDeclaration,
            currentAssignment: {
                type: 'object',
                value: objectData.objectRepresentation,
                eelSrc: objectData.eelSrc
            }
        };

        instance.setDeclaredSymbol(onlyDeclaration.id.name, newDeclaredSymbol);

        if (putInInit) {
            instance.setInitVariableName(onlyDeclaration.id.name);

            // We don't print the object because we do it in init
            return '';
        } else {
            return declarationSrc;
        }
    }

    const newDeclaredSymbol: DeclaredSymbol = {
        used: false,
        declarationType: declaration.kind as AllowedDeclarationType,
        inScopePath: instance.getCurrentScopePath(),
        inScopeSuffix: instance.getCurrentScopeSuffix(),
        name: onlyDeclaration.id.name,
        node: onlyDeclaration.id,
        currentAssignment: null
    };

    leftSideSrc += suffixScopeBySymbol(onlyDeclaration.id.name, newDeclaredSymbol);

    const inlineData = instance.consumeCurrentInlineData();

    if (inlineData) {
        declarationSrc = inlineData.srcs.join('') + leftSideSrc + operatorSrc + rightSideSrc;
    } else {
        declarationSrc = leftSideSrc + operatorSrc + rightSideSrc;
    }

    // Add semi if on root because it's no block statement
    declarationSrc = addSemicolonIfNone(declarationSrc);

    if (onlyDeclaration.init) {
        newDeclaredSymbol.currentAssignment = {
            type: 'variable',
            eelSrc: ''
        };

        newDeclaredSymbol.currentAssignment.eelSrc = declarationSrc;
    }

    instance.setDeclaredSymbol(onlyDeclaration.id.name, newDeclaredSymbol);

    if (putInInit) {
        // We collect let & const declared vars in init stage; later slider identifiers are filtered out.
        instance.setInitVariableName(onlyDeclaration.id.name);
    }

    if (doNotPrint) {
        return '';
    } else {
        return declarationSrc;
    }
};
