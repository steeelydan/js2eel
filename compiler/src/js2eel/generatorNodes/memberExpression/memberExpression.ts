import { memberExpressionCall } from './memberExpressionCall.js';
import { memberExpressionStatic } from './memberExpressionStatic.js';
import { memberExpressionComputed } from './memberExpressionComputed.js';

import type { MemberExpression, Node } from 'estree';
import type { Js2EelCompiler } from '../../index.js';

export const memberExpression = (
    parentNode: Node | null,
    memberExpression: MemberExpression,
    instance: Js2EelCompiler
): string => {
    let memberExpressionSrc = '';

    if (memberExpression.computed) {
        memberExpressionSrc += memberExpressionComputed(memberExpression, instance);
    } else {
        if (parentNode && parentNode.type === 'CallExpression') {
            memberExpressionSrc += memberExpressionCall(parentNode, instance);
        } else if (
            memberExpression.object.type === 'Identifier' &&
            memberExpression.property.type === 'Identifier'
        ) {
            memberExpressionSrc += memberExpressionStatic(memberExpression, instance);
        } else {
            instance.error(
                'TypeError',
                `memberExpression(): Only array access, buffer access and object access are allowed.`,
                parentNode
            );
        }
    }

    return memberExpressionSrc;
};
