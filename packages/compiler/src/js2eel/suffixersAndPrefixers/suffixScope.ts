import type { DeclaredSymbol } from '../types';

export const suffixScopeBySymbol = (symbolName: string, declaredSymbol: DeclaredSymbol): string => {
    if (declaredSymbol.inScopeSuffix > 0) {
        return `${symbolName}__S${declaredSymbol.inScopeSuffix}`;
    } else {
        return symbolName;
    }
};

export const suffixScopeByScopeSuffix = (symbolName: string, scopeSuffix: number): string => {
    if (scopeSuffix > 0) {
        return `${symbolName}__S${scopeSuffix}`;
    } else {
        return symbolName;
    }
}