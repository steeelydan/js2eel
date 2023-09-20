import { literal } from '../literal/literal';
import { identifier } from '../identifier/identifier';
import { unaryExpression } from '../unaryExpression/unaryExpression';
import { binaryExpression } from '../binaryExpression/binaryExpression';

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
        default: {
            instance.error(
                'TypeError',
                `Type ${conditionalExpressionNode.consequent.type} not allowed`,
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
            default: {
                instance.error(
                    'TypeError',
                    `Type ${conditionalExpressionNode.alternate.type} not allowed`,
                    conditionalExpressionNode.alternate
                );
            }
        }
    }

    return conditionalExpressionSrc;
};
