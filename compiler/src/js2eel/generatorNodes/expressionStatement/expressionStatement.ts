import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { assignmentExpression } from '../assignmentExpression/assignmentExpression.js';
import { callExpression } from '../callExpression/callExpression.js';
import { addSemicolonIfNone } from '../../suffixersAndPrefixers/addSemicolonIfNone.js';

import type { ExpressionStatement, Node } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';

export const expressionStatement = (
    parentNode: Node,
    expressionStatement: ExpressionStatement,
    instance: Js2EelCompiler
): string => {
    let expressionSrc = '';

    // instance.startCurrentInlineData();

    switch (expressionStatement.expression.type) {
        case 'CallExpression': {
            expressionSrc += callExpression(expressionStatement.expression, instance);
            break;
        }
        case 'BinaryExpression': {
            expressionSrc += binaryExpression(expressionStatement.expression, instance);
            break;
        }
        case 'AssignmentExpression': {
            expressionSrc += assignmentExpression(expressionStatement.expression, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Expression type not allowed: ${expressionStatement.expression.type}`,
                expressionStatement.expression
            );
        }
    }

    const inlineData = instance.consumeCurrentInlineData();

    if (inlineData) {
        expressionSrc = inlineData.srcs.join('') + expressionSrc;
    }

    if (parentNode.type === 'BlockStatement') {
        expressionSrc = addSemicolonIfNone(expressionSrc);
    }

    return expressionSrc;
};
