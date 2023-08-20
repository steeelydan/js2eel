import { getLastScopePathSeparator } from '../../shared/shared.js';
import type { Js2EelCompiler } from '../compiler/Js2EelCompiler.js';
import type { ScopedEnvironment } from '../types.js';

export const getLowerCasedDeclaredSymbol = (
    symbolName: string,
    instance: Js2EelCompiler
): boolean => {
    let scopedEnvironment: ScopedEnvironment | undefined;

    let currentScopePath = instance.getCurrentScopePath();

    const environment = instance.getScopeRegister();

    while (currentScopePath !== 'roo') {
        scopedEnvironment = environment[currentScopePath];
        if (scopedEnvironment) {
            const foundCandidate =
                scopedEnvironment.lowercaseDeclaredSymbols[symbolName.toLowerCase()];
            if (foundCandidate) {
                return true;
            }
        }

        const cutIndex = getLastScopePathSeparator(currentScopePath);
        currentScopePath = currentScopePath.slice(0, cutIndex);
    }

    return false;
};
