import { literal } from '../literal/literal.js';
import { operator } from '../operator/operator.js';
import { identifier } from '../identifier/identifier.js';
import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { conditionalExpression } from '../conditionalExpression/conditionalExpression.js';
import { callExpression } from '../callExpression/callExpression.js';
import { memberExpression } from '../memberExpression/memberExpression.js';

import { addSemicolonIfNone } from '../../suffixersAndPrefixers/addSemicolonIfNone.js';
import { getSymbolInNextUpScope } from '../../environment/getSymbolInNextUpScope.js';
import { ALLOWED_ASSIGNMENT_OPERATORS } from '../../constants.js';

import type { AssignmentExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';

export const assignmentExpression = (
    expression: AssignmentExpression,
    instance: Js2EelCompiler
): string | null => {
    let assignmentSrc = '';
    let leftSideSrc = '';
    let operatorSrc = '';
    let rightSideSrc = '';

    const expressionLeft = expression.left;
    const expressionRight = expression.right;

    const assignmentOperator = expression.operator;

    if (!ALLOWED_ASSIGNMENT_OPERATORS.has(assignmentOperator)) {
        instance.error(
            'OperatorError',
            `Assignment operator not allowed: ${assignmentOperator}`,
            expression
        );

        return '';
    }

    instance.startCurrentInlineData();

    // Select box enums
    if (expressionLeft.type === 'Identifier') {
        const potentialSelectBox = instance.getSelectBox(expressionLeft.name);

        if (potentialSelectBox) {
            if (expressionRight.type !== 'Literal') {
                instance.error(
                    'TypeError',
                    `Select box value must be a literal. Actual: ${expressionRight.type}`,
                    expressionRight
                );

                return '';
            }
            if (typeof expressionRight.value !== 'string') {
                instance.error(
                    'TypeError',
                    `Select box value must be a string. Actual: ${typeof expressionRight.value}`,
                    expressionRight
                );

                return '';
            }

            if (!potentialSelectBox.values.find((value) => value.name === expressionRight.value)) {
                instance.error(
                    'UnknownSymbolError',
                    `Select box value not allowed: ${
                        expressionRight.value
                    }. Must be one of: ${potentialSelectBox.values
                        .map((value) => value.name)
                        .join(', ')}`,
                    expressionRight
                );

                return '';
            }

            leftSideSrc += identifier(expressionLeft, instance);
            leftSideSrc += ` ${operator(expression, instance)} `;
            leftSideSrc += potentialSelectBox.values.findIndex(
                (value) => value.name === expressionRight.value
            );

            return leftSideSrc;
        }
    }

    // Normal cases

    switch (expressionLeft.type) {
        case 'Identifier': {
            const declaredSymbol = getSymbolInNextUpScope(expressionLeft.name, instance);

            if (
                declaredSymbol &&
                declaredSymbol.symbol.declarationType &&
                declaredSymbol.symbol.declarationType === 'const'
            ) {
                instance.error(
                    'GenericError',
                    `Cannot assign to constant variable ${expressionLeft.name}`,
                    expressionLeft
                );
            }

            leftSideSrc += identifier(expressionLeft, instance);
            break;
        }
        case 'MemberExpression': {
            leftSideSrc += memberExpression(expression, expressionLeft, instance);
            break;
        }
        // FIXME find out how to test that
        /* c8 ignore start */
        default: {
            instance.error(
                'TypeError',
                `Assignment, left part: Type ${expressionLeft.type} not allowed`,
                expressionLeft
            );
        }
        /* c8 ignore stop */
    }

    operatorSrc += ' ' + operator(expression, instance) + ' ';

    switch (expression.right.type) {
        case 'BinaryExpression': {
            rightSideSrc += binaryExpression(expression.right, instance);
            break;
        }
        case 'Literal': {
            rightSideSrc += literal(expression.right, instance);
            break;
        }
        case 'Identifier': {
            rightSideSrc += identifier(expression.right, instance);
            break;
        }
        case 'CallExpression': {
            rightSideSrc += callExpression(expression.right, instance);
            break;
        }
        case 'MemberExpression': {
            rightSideSrc += memberExpression(expression, expression.right, instance);

            break;
        }
        case 'ConditionalExpression': {
            rightSideSrc += conditionalExpression(expression.right, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                'Assignment, right part: ' + expression.right.type + ' not allowed',
                expression.right
            );
        }
    }

    const inlineData = instance.consumeCurrentInlineData();

    if (inlineData) {
        assignmentSrc = `${inlineData.srcs.join('')}${leftSideSrc}${operatorSrc}${rightSideSrc}`;
    } else {
        assignmentSrc = leftSideSrc + operatorSrc + rightSideSrc;
    }

    assignmentSrc = addSemicolonIfNone(assignmentSrc);

    return assignmentSrc;
};
