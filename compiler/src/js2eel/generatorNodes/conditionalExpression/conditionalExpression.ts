import { literal } from '../literal/literal.js';
import { identifier } from '../identifier/identifier.js';
import { unaryExpression } from '../unaryExpression/unaryExpression.js';
import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { memberExpression } from '../memberExpression/memberExpression.js';

import type { ConditionalExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';

export const conditionalExpression = (
    conditionalExpressionNode: ConditionalExpression,
    instance: Js2EelCompiler
): string => {
    let conditionalExpressionSrc = '';

    switch (conditionalExpressionNode.test.type) {
        case 'BinaryExpression': {
            conditionalExpressionSrc += binaryExpression(conditionalExpressionNode.test, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Type ${conditionalExpressionNode.test.type} not allowed`,
                conditionalExpressionNode.test
            );
        }
    }

    conditionalExpressionSrc += ' ? ';

    switch (conditionalExpressionNode.consequent.type) {
        case 'Identifier': {
            conditionalExpressionSrc += identifier(conditionalExpressionNode.consequent, instance);
            break;
        }
        case 'Literal': {
            conditionalExpressionSrc += literal(conditionalExpressionNode.consequent, instance);
            break;
        }
        case 'UnaryExpression': {
            conditionalExpressionSrc += unaryExpression(
                conditionalExpressionNode.consequent,
                instance
            );
            break;
        }
        case 'BinaryExpression': {
            conditionalExpressionSrc += binaryExpression(
                conditionalExpressionNode.consequent,
                instance
            );
            break;
        }
        case 'MemberExpression': {
            conditionalExpressionSrc += memberExpression(
                conditionalExpressionNode,
                conditionalExpressionNode.consequent,
                instance
            );
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Conditional expression: Consequent: Type ${conditionalExpressionNode.consequent.type} not allowed`,
                conditionalExpressionNode.consequent
            );
        }
    }
    if (conditionalExpressionNode.alternate) {
        conditionalExpressionSrc += ' : ';

        switch (conditionalExpressionNode.alternate.type) {
            case 'Identifier': {
                conditionalExpressionSrc += identifier(
                    conditionalExpressionNode.alternate,
                    instance
                );
                break;
            }
            case 'Literal': {
                conditionalExpressionSrc += literal(conditionalExpressionNode.alternate, instance);
                break;
            }
            case 'UnaryExpression': {
                conditionalExpressionSrc += unaryExpression(
                    conditionalExpressionNode.alternate,
                    instance
                );
                break;
            }
            case 'BinaryExpression': {
                conditionalExpressionSrc += binaryExpression(
                    conditionalExpressionNode.alternate,
                    instance
                );
                break;
            }
            case 'MemberExpression': {
                conditionalExpressionSrc += memberExpression(
                    conditionalExpressionNode,
                    conditionalExpressionNode.alternate,
                    instance
                );
                break;
            }
            default: {
                instance.error(
                    'TypeError',
                    `Conditional expression: Alternate: Type ${conditionalExpressionNode.alternate.type} not allowed`,
                    conditionalExpressionNode.alternate
                );
            }
        }
    }

    return conditionalExpressionSrc;
};
