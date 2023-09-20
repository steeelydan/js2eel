import { getLastScopePathSeparator } from '../../shared/shared.js';

import type { Js2EelCompiler } from '../compiler/Js2EelCompiler.js';
import type { DeclaredSymbol, ScopedEnvironment } from '../types.js';

export const getSymbolInNextUpScope = (
    symbolName: string,
    instance: Js2EelCompiler
): { symbol: DeclaredSymbol; scopeSuffix: number } | null => {
    let candidate: DeclaredSymbol | null = null;
    let scopedEnvironment: ScopedEnvironment | undefined;

    let currentScopePath = instance.getCurrentScopePath();

    const environment = instance.getScopeRegister();

    while (currentScopePath !== 'roo') {
        scopedEnvironment = environment[currentScopePath];
        if (scopedEnvironment) {
            const foundCandidate = scopedEnvironment.symbols[symbolName];
            if (foundCandidate) {
                candidate = foundCandidate;
                break;
            }
        }

        const cutIndex = getLastScopePathSeparator(currentScopePath);
        currentScopePath = currentScopePath.slice(0, cutIndex);
    }

    return candidate && scopedEnvironment ? { symbol: candidate, scopeSuffix: scopedEnvironment.scopeSuffix } : null;
};
