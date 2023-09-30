import { suffixScopeByScopeSuffix } from '../../suffixersAndPrefixers/suffixScope';

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

    if (potentialDeclaredSymbol.symbol.currentAssignment?.type !== 'object') {
        instance.error(
            'TypeError',
            `Accessed symbol is no object but ${potentialDeclaredSymbol.symbol.currentAssignment?.type}`,
            memberExpression.object
        );

        return '';
    }

    const object = potentialDeclaredSymbol.symbol.currentAssignment.value;

    const key = memberExpression.property.name;

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

    instance.setSymbolUsed(memberExpression.object.name);

    return memberExpressionStaticSrc;
};
