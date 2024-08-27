import { blockStatement } from '../blockStatement/blockStatement.js';
import { unaryExpression } from '../unaryExpression/unaryExpression.js';
import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { logicalExpression } from '../logicalExpression/logicalExpression.js';
import { identifier } from '../identifier/identifier.js';
import { indent } from '../../suffixersAndPrefixers/indent.js';
import { removeLastLinebreak } from '../../suffixersAndPrefixers/removeLastLinebreak.js';
import { addSemicolonIfNone } from '../../suffixersAndPrefixers/addSemicolonIfNone.js';

import type { IfStatement } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { JSFX_DENY_COMPILATION } from '../../constants.js';

export const ifStatement = (ifStatementNode: IfStatement, instance: Js2EelCompiler): string => {
    let ifSrc = ``;

    let testSrc = '';
    let consequentSrc = '';
    let alternateSrc = '';

    switch (ifStatementNode.test.type) {
        case 'UnaryExpression': {
            testSrc += unaryExpression(ifStatementNode.test, instance);
            break;
        }
        case 'BinaryExpression': {
            testSrc += binaryExpression(ifStatementNode.test, instance);
            break;
        }
        case 'LogicalExpression': {
            testSrc += logicalExpression(ifStatementNode.test, instance);
            break;
        }
        case 'Identifier': {
            testSrc += identifier(ifStatementNode.test, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Type ${ifStatementNode.test.type} not allowed`,
                ifStatementNode.test
            );

            testSrc += JSFX_DENY_COMPILATION;
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

            consequentSrc += JSFX_DENY_COMPILATION;
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

                alternateSrc += JSFX_DENY_COMPILATION;
            }
        }
    }

    ifSrc += testSrc;
    ifSrc += ' ? ';
    ifSrc += `(\n${indent(removeLastLinebreak(consequentSrc))}
)`;

    if (alternateSrc) {
        ifSrc += ' : ';
        ifSrc += `(
${indent(removeLastLinebreak(alternateSrc))}
)`;
    }

    return addSemicolonIfNone(ifSrc);
};
