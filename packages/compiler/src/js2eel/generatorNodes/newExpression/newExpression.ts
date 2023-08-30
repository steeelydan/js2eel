import type { NewExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { newEelBuffer } from './js2EelLib/newEelBuffer.js';
import { newEelArray } from './js2EelLib/newEelArray.js';

export const newExpression = (
    newExpression: NewExpression,
    symbolName: string,
    instance: Js2EelCompiler
): string => {
    if (instance.getCurrentScopePath() !== 'root') {
        instance.error('ScopeError', 'Class instantiation not allowed here.', newExpression);
        return '';
    }

    const newExpressionSrc = '';

    /* c8 ignore start */
    if (newExpression.callee.type !== 'Identifier') {
        instance.error(
            'TypeError',
            `Callee type ${newExpression.callee.type} not allowed`,
            newExpression.callee
        );

        return '';
    }
    /* c8 ignore stop */

    switch (newExpression.callee.name) {
        case 'EelBuffer': {
            newEelBuffer(newExpression, symbolName, instance);

            break;
        }

        case 'EelArray': {
            newEelArray(newExpression, symbolName, instance);

            break;
        }

        default: {
            instance.error(
                'UnknownSymbolError',
                `Class does not exist: ${newExpression.callee.name}`,
                newExpression.callee
            );
        }
    }

    return newExpressionSrc;
};
