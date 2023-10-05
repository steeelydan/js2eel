import { newEelBuffer } from './js2EelLib/newEelBuffer.js';
import { newEelArray } from './js2EelLib/newEelArray.js';
import { JSFX_DENY_COMPILATION } from '../../constants.js';

import type { NewExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { EelNewExpressionType } from '../../types.js';

export const newExpression = (
    newExpression: NewExpression,
    symbolName: string,
    instance: Js2EelCompiler
): { newType: EelNewExpressionType | null; src: string } => {
    let newType: EelNewExpressionType | null = null;

    if (instance.getCurrentScopePath() !== 'root') {
        instance.error('ScopeError', 'Class instantiation not allowed here.', newExpression);
        return { newType, src: JSFX_DENY_COMPILATION };
    }

    const newExpressionSrc = '';

    /* c8 ignore start */
    if (newExpression.callee.type !== 'Identifier') {
        instance.error(
            'TypeError',
            `Callee type ${newExpression.callee.type} not allowed`,
            newExpression.callee
        );

        return { newType, src: JSFX_DENY_COMPILATION };
    }
    /* c8 ignore stop */

    switch (newExpression.callee.name) {
        case 'EelBuffer': {
            newEelBuffer(newExpression, symbolName, instance);

            newType = 'EelBuffer';

            break;
        }

        case 'EelArray': {
            newEelArray(newExpression, symbolName, instance);

            newType = 'EelArray';

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

    return { newType, src: newExpressionSrc };
};
