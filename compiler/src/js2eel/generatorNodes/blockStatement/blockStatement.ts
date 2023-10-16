import { variableDeclaration } from '../variableDeclaration/variableDeclaration.js';
import { functionDeclaration } from '../functionDeclaration/functionDeclaration.js';
import { expressionStatement } from '../expressionStatement/expressionStatement.js';
import { returnStatement } from '../returnStatement/returnStatement.js';
import { ifStatement } from '../ifStatement/ifStatement.js';

import type { BlockStatement } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';

export const blockStatement = (
    blockStatement: BlockStatement,
    parentName: string | null,
    instance: Js2EelCompiler,
    isFunctionBody = false
): string => {
    let blockSrc = '';

    const parentScope = instance.getCurrentScopePath();

    if (!isFunctionBody) {
        instance.moveDownInScope(parentName);
    }

    blockStatement.body.forEach((blockBody) => {
        switch (blockBody.type) {
            case 'IfStatement': {
                blockSrc += ifStatement(blockBody, instance);
                break;
            }
            case 'ExpressionStatement': {
                blockSrc += expressionStatement(blockStatement, blockBody, instance);
                break;
            }
            case 'VariableDeclaration': {
                blockSrc += variableDeclaration(blockBody, instance);
                break;
            }
            case 'ReturnStatement': {
                returnStatement(blockBody, parentScope, instance);
                break;
            }
            case 'FunctionDeclaration': {
                functionDeclaration(blockBody, instance);
                break;
            }
            default: {
                if (blockBody.type === 'EmptyStatement') {
                    instance.error(
                        'TypeError',
                        `Body type ${blockBody.type} not allowed. Did you insert a superfluous semicolon?`,
                        blockStatement
                    );
                } else {
                    instance.error(
                        'TypeError',
                        `Body type ${blockBody.type} not allowed`,
                        blockStatement
                    );
                }
            }
        }
    });

    if (!isFunctionBody) {
        instance.moveUpInScope();
    }
    return blockSrc;
};
