import type { AssignmentExpression, BinaryExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';

export const operator = (
    expressionNode: BinaryExpression | AssignmentExpression,
    _instance: Js2EelCompiler
): string => {
    const operatorText = expressionNode.operator;

    if (operatorText === '**') {
        return '^';
    } else if (operatorText === '===') {
        return '==';
    } else {
        return operatorText;
    }
};
