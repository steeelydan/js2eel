import { identifier } from '../identifier/identifier.js';

import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { ALLOWED_Unary_OPERATORS } from '../../constants.js';

import type { UnaryExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';

export const unaryExpression = (expression: UnaryExpression, instance: Js2EelCompiler): string => {
    let unarySrc = '';

    const unaryOperator = expression.operator;

    if (!ALLOWED_Unary_OPERATORS.has(unaryOperator)) {
        instance.error('OperatorError', `Unary operator not allowed: ${unaryOperator}`, expression);

        return '';
    }

    switch (expression.argument.type) {
        case 'Literal': {
            // We don't nee the operator here because the literal will be parsed as JS number anyway
            unarySrc += parseFloat(expression.operator + expression.argument.value).toString();

            break;
        }
        case 'Identifier': {
            unarySrc += unaryOperator;

            unarySrc += identifier(expression.argument, instance);

            break;
        }
        case 'BinaryExpression': {
            unarySrc += unaryOperator;

            unarySrc += binaryExpression(expression.argument, instance);

            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Unary argument type not allowed: ${expression.argument.type}`,
                expression.argument
            );
            return '';
        }
    }

    return unarySrc;
};
