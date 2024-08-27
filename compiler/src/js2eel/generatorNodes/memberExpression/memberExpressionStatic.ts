import { suffixScopeByScopeSuffix } from '../../suffixersAndPrefixers/suffixScope.js';
import { prefixParam } from '../../suffixersAndPrefixers/prefixParam.js';

import type { Identifier, MemberExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';

export const memberExpressionStatic = (
    memberExpression: MemberExpression,
    instance: Js2EelCompiler
): string => {
    let memberExpressionStaticSrc = '';

    /* c8 ignore start */
    if (
        memberExpression.object.type !== 'Identifier' ||
        memberExpression.property.type !== 'Identifier'
    ) {
        return ''; // Caught higher up in memberExpression FIXME is this feasible
    }
    /* c8 ignore stop */

    const objectIdentifierName = (memberExpression.object as Identifier).name;

    const potentialDeclaredSymbol = instance.getDeclaredSymbolUpInScope(objectIdentifierName);

    if (!potentialDeclaredSymbol) {
        instance.error(
            'UnknownSymbolError',
            `Symbol not found or not possible to assign to it: ${
                (memberExpression.object as Identifier).name
            }`,
            memberExpression.object
        );

        return '';
    }

    const key = memberExpression.property.name;

    if (potentialDeclaredSymbol.symbol.declarationType === 'param') {
        // FIXME: Can we ever check if even is object?

        // Scope will never be root if the symbol is a function param
        memberExpressionStaticSrc += `${prefixParam(
            suffixScopeByScopeSuffix(objectIdentifierName, instance.getCurrentScopeSuffix())
        )}__${key}`;
    } else {
        if (potentialDeclaredSymbol.symbol.currentAssignment?.type !== 'object') {
            instance.error(
                'TypeError',
                `Accessed symbol is no object but ${potentialDeclaredSymbol.symbol.currentAssignment?.type}`,
                memberExpression.object
            );

            return '';
        }

        const object = potentialDeclaredSymbol.symbol.currentAssignment.value;

        if (!(key in object)) {
            instance.error(
                'UnknownSymbolError',
                `Key ${key} not in object ${memberExpression.object.name}`,
                memberExpression.property
            );

            return '';
        }

        let scoped = false;

        if (potentialDeclaredSymbol.scopeSuffix !== 0) {
            scoped = true;
        }

        const identifier = `${memberExpression.object.name}__${
            scoped ? suffixScopeByScopeSuffix(key, potentialDeclaredSymbol.scopeSuffix) : key
        }`;

        memberExpressionStaticSrc += identifier;
    }

    instance.setSymbolUsed(memberExpression.object.name);

    return memberExpressionStaticSrc;
};
