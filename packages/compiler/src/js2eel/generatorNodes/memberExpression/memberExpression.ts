import { objectMemberExpression } from './objectMemberExpression.js';
import { accessorMemberExpression } from './accessorMemberExpression.js';

import type { MemberExpression, Node } from 'estree';
import type { Js2EelCompiler } from '../../index.js';

export const memberExpression = (
    parentNode: Node | null,
    memberExpression: MemberExpression,
    instance: Js2EelCompiler
): string => {
    let memberExpressionSrc = '';

    if (parentNode && parentNode.type === 'CallExpression') {
        memberExpressionSrc += objectMemberExpression(parentNode, instance);
    } else {
        if (memberExpression.computed) {
            memberExpressionSrc += accessorMemberExpression(memberExpression, instance);
        } else {
            instance.error(
                'TypeError',
                `memberExpression(): No parent node exists. But member expression is also not computed, so it's not an accessor expression.`,
                parentNode
            );
        }
    }

    return memberExpressionSrc;
};
