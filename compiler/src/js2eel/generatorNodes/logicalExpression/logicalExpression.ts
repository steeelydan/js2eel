import type { LogicalExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { identifier } from '../identifier/identifier';
import { jsfxDenyCompilation } from '../../utils/jsfxNonCompilable';
import { unaryExpression } from '../unaryExpression/unaryExpression';
import { binaryExpression } from '../binaryExpression/binaryExpression';

export const logicalExpression = (
    logicalExpressionNode: LogicalExpression,
    instance: Js2EelCompiler
): string => {
    let logicalExprSrc = '';

    const left = logicalExpressionNode.left;
    const right = logicalExpressionNode.right;

    switch (left.type) {
        case 'Identifier': {
            logicalExprSrc += identifier(left, instance);
            break;
        }
        case 'UnaryExpression': {
            logicalExprSrc += unaryExpression(left, instance);
            break;
        }
        case 'BinaryExpression': {
            logicalExprSrc += binaryExpression(left, instance);
            break;
        }
        case 'LogicalExpression': {
            logicalExprSrc += logicalExpression(left, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Logical Expression: Left type not allowed: ${left.type}`,
                left
            );

            return jsfxDenyCompilation();
        }
    }

    logicalExprSrc += ` ${logicalExpressionNode.operator} `; // Eel supports the same logical operators as JS, "&&" and "||"

    switch (right.type) {
        case 'Identifier': {
            logicalExprSrc += identifier(right, instance);
            break;
        }
        case 'UnaryExpression': {
            logicalExprSrc += unaryExpression(right, instance);
            break;
        }
        case 'BinaryExpression': {
            logicalExprSrc += binaryExpression(right, instance);
            break;
        }
        case 'LogicalExpression': {
            logicalExprSrc += logicalExpression(right, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Logical Expression: Right type not allowed: ${right.type}`,
                right
            );

            return jsfxDenyCompilation();
        }
    }

    return `(${logicalExprSrc})`;
};
