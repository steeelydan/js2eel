import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { blockStatement } from '../blockStatement/blockStatement.js';

import type { IfStatement } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { addSemicolonIfNone } from '../../suffixersAndPrefixers/addSemicolonIfNone.js';

export const ifStatement = (ifStatementNode: IfStatement, instance: Js2EelCompiler): string => {
    let ifSrc = ``;

    let testSrc = '';
    let consequentSrc = '';
    let alternateSrc = '';

    switch (ifStatementNode.test.type) {
        case 'BinaryExpression': {
            testSrc += binaryExpression(ifStatementNode.test, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Type ${ifStatementNode.test.type} not allowed`,
                ifStatementNode.test
            );
        }
    }

    switch (ifStatementNode.consequent.type) {
        case 'BlockStatement': {
            consequentSrc += blockStatement(ifStatementNode.consequent, null, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Type ${ifStatementNode.consequent} not allowed`,
                ifStatementNode.consequent
            );
        }
    }
    if (ifStatementNode.alternate) {
        switch (ifStatementNode.alternate.type) {
            case 'BlockStatement': {
                alternateSrc += blockStatement(ifStatementNode.alternate, null, instance);

                break;
            }
            case 'IfStatement': {
                alternateSrc += ifStatement(ifStatementNode.alternate, instance);
                break;
            }
            default: {
                instance.error(
                    'TypeError',
                    `Type ${ifStatementNode.alternate.type} not allowed`,
                    ifStatementNode.alternate
                );
            }
        }
    }

    ifSrc += testSrc;
    ifSrc += ' ? ';
    ifSrc += `(\n${consequentSrc})`;

    if (alternateSrc) {
        ifSrc += ' : ';
        ifSrc += `${alternateSrc}`;
    }

    return addSemicolonIfNone(ifSrc);
};
