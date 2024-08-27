import { literal } from '../literal/literal.js';
import { operator } from '../operator/operator.js';
import { identifier } from '../identifier/identifier.js';
import { unaryExpression } from '../unaryExpression/unaryExpression.js';
import { callExpression } from '../callExpression/callExpression.js';
import { memberExpression } from '../memberExpression/memberExpression.js';
import { ALLOWED_BINARY_OPERATORS, JSFX_DENY_COMPILATION } from '../../constants.js';

import type { BinaryExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';

export const binaryExpression = (
    expression: BinaryExpression,
    instance: Js2EelCompiler
): string => {
    let binarySrc = '';
    let leftSrc = '';
    let operatorSrc = '';
    let rightSrc = '';

    const binaryOperator = expression.operator;

    if (!ALLOWED_BINARY_OPERATORS.has(binaryOperator)) {
        instance.error(
            'OperatorError',
            `Binary operator not allowed: ${binaryOperator}`,
            expression
        );

        return JSFX_DENY_COMPILATION;
    }

    // Select box enum value
    if (expression.left.type === 'Identifier') {
        const potentialSelectBox = instance.getSelectBox(expression.left.name);

        const rightExpression = expression.right;

        if (potentialSelectBox) {
            if (rightExpression.type !== 'Literal') {
                instance.error(
                    'TypeError',
                    `Select box value must be a literal. Actual: ${rightExpression.type}`,
                    rightExpression
                );

                return JSFX_DENY_COMPILATION;
            }
            if (typeof rightExpression.value !== 'string') {
                instance.error(
                    'TypeError',
                    `Select box value must be a string. Actual: ${typeof rightExpression.value}`,
                    rightExpression
                );

                return JSFX_DENY_COMPILATION;
            }

            if (!potentialSelectBox.values.find((value) => value.name === rightExpression.value)) {
                instance.error(
                    'TypeError',
                    `Select box value not allowed: ${
                        rightExpression.value
                    }. Must be one of: ${potentialSelectBox.values
                        .map((value) => value.name)
                        .join(', ')}`,
                    rightExpression
                );

                return JSFX_DENY_COMPILATION;
            }

            binarySrc += identifier(expression.left, instance);
            binarySrc += ` ${operator(expression, instance)} `;
            binarySrc += potentialSelectBox.values.findIndex(
                (value) => value.name === rightExpression.value
            );

            return binarySrc;
        }
    }

    // Normal cases

    switch (expression.left.type) {
        case 'Identifier': {
            leftSrc += identifier(expression.left, instance);
            break;
        }
        case 'Literal': {
            leftSrc += literal(expression.left, instance);
            break;
        }
        case 'CallExpression': {
            leftSrc += callExpression(expression.left, instance);
            break;
        }
        case 'BinaryExpression': {
            leftSrc += binaryExpression(expression.left, instance);
            break;
        }
        case 'UnaryExpression': {
            leftSrc += unaryExpression(expression.left, instance);
            break;
        }
        case 'MemberExpression': {
            leftSrc += memberExpression(expression, expression.left, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `binaryExpression() -> left: Expression type not allowed: ${expression.left.type}`,
                expression.left
            );
        }
    }

    operatorSrc += ` ${operator(expression, instance)} `;

    switch (expression.right.type) {
        case 'UnaryExpression': {
            rightSrc += unaryExpression(expression.right, instance);
            break;
        }
        case 'BinaryExpression': {
            rightSrc += binaryExpression(expression.right, instance);
            break;
        }
        case 'Literal': {
            rightSrc += literal(expression.right, instance);
            break;
        }
        case 'CallExpression': {
            rightSrc += callExpression(expression.right, instance);
            break;
        }
        case 'Identifier': {
            rightSrc += identifier(expression.right, instance);
            break;
        }
        case 'MemberExpression': {
            rightSrc += memberExpression(expression, expression.right, instance);
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `binaryExpression() -> right: Expression type not allowed: ${expression.right.type}`,
                expression.right
            );
        }
    }

    if (expression.operator === '/' || expression.operator === '**') {
        rightSrc = `(${rightSrc})`;
    }

    binarySrc = leftSrc + operatorSrc + rightSrc;

    /* EEL OPERATOR PRECEDENCE
        (shortened)
     https://www.reaper.fm/sdk/js/basiccode.php

      Listed from highest precedence to lowest (but one should use parentheses whenever there is doubt!):

    [ ]

    !value -- returns the logical NOT of the parameter (if the parameter is 0.0, returns 1.0, otherwise returns 0.0).
    -value -- returns value with a reversed sign (-1 * value).
    +value -- returns value unmodified.

    base ^ exponent -- returns the first parameter raised to the power of the second parameter. This is also available the function pow(x,y)

    numerator % denominator -- divides two values as integers and returns the remainder.

    value << shift_amt -- converts both values to 32 bit integers, bitwise left shifts the first value by the second. Note that shifts by more than 32 or less than 0 produce undefined results. -- REAPER 4.111+

    value >> shift_amt -- converts both values to 32 bit integers, bitwise right shifts the first value by the second, with sign-extension (negative values of y produce non-positive results). Note that shifts by more than 32 or less than 0 produce undefined results. -- REAPER 4.111+

    value / divisor -- divides two values and returns the quotient.

    value * another_value -- multiplies two values and returns the product.

    value - another_value -- subtracts two values and returns the difference.

    value + another_value -- adds two values and returns the sum.

    Note: the relative precedence of |, &, and ~ are equal, meaning a mix of these operators is evaluated left-to-right (which is different from other languages and may not be as expected). Use parentheses when mixing these operators.
    a | b -- converts both values to integer, and returns bitwise OR of values.
    a & b -- converts both values to integer, and returns bitwise AND of values.
    a ~ b -- converts both values to 32 bit integers, bitwise XOR the values. -- REAPER 4.25+

    value1 == value2 -- compares two values, returns 1 if difference is less than 0.00001, 0 if not.
    value1 === value2 -- compares two values, returns 1 if exactly equal, 0 if not. -- REAPER 4.53+
    value1 != value2 -- compares two values, returns 0 if difference is less than 0.00001, 1 if not.
    value1 !== value2 -- compares two values, returns 0 if exactly equal, 1 if not. -- REAPER 4.53+
    value1 < value2 -- compares two values, returns 1 if first parameter is less than second.
    value1 > value2 -- compares two values, returns 1 if first parameter is greater than second.
    value1 <= value2 -- compares two values, returns 1 if first is less than or equal to second.
    value1 >= value2 -- compares two values, returns 1 if first is greater than or equal to second.

    Note: the relative precedence of || and && are equal, meaning a mix of these operators is evaluated left-to-right (which is different from other languages and may not be as expected). Use parentheses when mixing these operators.
    y || z -- returns logical OR of values. If 'y' is nonzero, 'z' is not evaluated.
    y && z -- returns logical AND of values. If 'y' is zero, 'z' is not evaluated.

    y ? z      -- how conditional branching is done -- similar to C's if/else
    y ? z : x

    y = z -- assigns the value of 'z' to 'y'. 'z' can be a variable or an expression.
    y *= z -- multiplies two values and stores the product back into 'y'.
    y /= divisor -- divides two values and stores the quotient back into 'y'.
    y %= divisor -- divides two values as integers and stores the remainder back into 'y'.
    base ^= exponent -- raises first parameter to the second parameter-th power, saves back to 'base'
    y += z -- adds two values and stores the sum back into 'y'.
    y -= z -- subtracts 'z' from 'y' and stores the difference into 'y'.
    y |= z -- converts both values to integer, and stores the bitwise OR into 'y'
    y &= z -- converts both values to integer, and stores the bitwise AND into 'y'
    y ~= z -- converts both values to integer, and stores the bitwise XOR into 'y' -- REAPER 4.25+
     */

    if (
        // FIXME: Are really all parens necessary?
        expression.operator === '+' ||
        expression.operator === '-' ||
        // expression.operator === '*' ||
        expression.operator === '**'
    ) {
        binarySrc = `(${binarySrc})`;
    }

    return binarySrc;
};
