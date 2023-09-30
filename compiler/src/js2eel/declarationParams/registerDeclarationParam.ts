import { getLowerCasedDeclaredSymbol } from '../environment/getLowerCaseDeclaredSymbol';
import { ALL_RESERVED_SYMBOL_NAMES } from '../constants';

import type { Identifier } from 'estree';
import type { Js2EelCompiler } from '../compiler/Js2EelCompiler';

export const registerDeclarationParam = (
    identifier: Identifier,
    instance: Js2EelCompiler
): void => {
    if (
        ALL_RESERVED_SYMBOL_NAMES.has(identifier.name) ||
        ALL_RESERVED_SYMBOL_NAMES.has(identifier.name.toLowerCase()) // We have to lowercase here to check EEL symbols as well
    ) {
        instance.error(
            'SymbolAlreadyDeclaredError',
            'Symbol name is reserved library symbol: ' + identifier.name,
            identifier
        );

        return;
    }

    if (getLowerCasedDeclaredSymbol(identifier.name.toLowerCase(), instance)) {
        instance.error(
            'SymbolAlreadyDeclaredError',
            `Symbol already declared: ${identifier.name}. Keep in mind EEL is case-insensitive.`,
            identifier
        );

        return;
    }

    instance.setDeclaredSymbol(identifier.name, {
        used: false,
        declarationType: 'param',
        inScopePath: instance.getCurrentScopePath(),
        inScopeSuffix: instance.getCurrentScopeSuffix(),
        name: identifier.name,
        node: identifier,
        currentAssignment: null
    });
};
