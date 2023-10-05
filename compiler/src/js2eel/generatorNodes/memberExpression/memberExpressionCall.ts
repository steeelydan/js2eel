import { mathMemberCall } from './js2EelLib/mathMemberCall.js';
import { consoleMemberCall } from './js2EelLib/consoleMemberCall.js';
import { eelBufferMemberCall } from './js2EelLib/eelBufferMemberCall.js';
import { eelArrayMemberCall } from './js2EelLib/eelArrayMemberCall.js';

import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { CallExpression } from 'estree';

export const memberExpressionCall = (
    parentCallExpression: CallExpression,
    instance: Js2EelCompiler
): string | null => {
    let parentCallExpressionSrc = '';

    const callee = parentCallExpression.callee;

    /* c8 ignore start */
    if (!('object' in callee)) {
        instance.error(
            'TypeError',
            'SimpleCallExpression not allowed. Parent CallExpression is of the wrong type: ' +
                parentCallExpression.type,
            parentCallExpression
        );

        return '';
    }
    /* c8 ignore stop */

    const calleeObject = callee.object;

    const calleeProperty = callee.property;

    /* c8 ignore start */
    if (!('name' in calleeProperty)) {
        instance.error(
            'TypeError',
            'SimpleCallExpression not allowed. Callee property is of the wrong type: ' +
                calleeProperty.type,
            callee
        );

        return '';
    }
    /* c8 ignore stop */

    switch (calleeObject.type) {
        case 'Identifier': {
            switch (calleeObject.name) {
                case 'Math': {
                    parentCallExpressionSrc += mathMemberCall(
                        parentCallExpression,
                        calleeProperty,
                        instance
                    );

                    break;
                }
                case 'console': {
                    parentCallExpressionSrc += consoleMemberCall(
                        parentCallExpression,
                        calleeProperty,
                        instance
                    );

                    break;
                }
                default: {
                    const eelBuffer = instance.getEelBuffer(calleeObject.name);
                    const eelArray = instance.getEelArray(calleeObject.name);

                    if (eelBuffer) {
                        parentCallExpressionSrc += eelBufferMemberCall(
                            eelBuffer,
                            calleeObject,
                            calleeProperty,
                            instance
                        );
                    } else if (eelArray) {
                        parentCallExpressionSrc += eelArrayMemberCall(
                            eelArray,
                            calleeProperty,
                            instance
                        );
                    } else {
                        instance.error(
                            'UnknownSymbolError',
                            'Not declared: ' + calleeObject.name,
                            calleeObject
                        );
                    }
                }
            }
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Object type not allowed: ${calleeObject.type}`,
                calleeObject
            );
            return '';
        }
    }

    instance.setSymbolUsed(calleeObject.name);

    return parentCallExpressionSrc;
};
