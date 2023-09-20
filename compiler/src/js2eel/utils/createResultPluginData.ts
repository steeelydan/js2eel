import type {
    PluginData,
    ResultDeclaredSymbol,
    ResultFunctionSymbol,
    ResultPluginData,
    ResultScopedEnvironment
} from '../types';

export const createResultPluginData = (pluginData: PluginData): ResultPluginData => {
    const resultPluginData: ResultPluginData = { ...pluginData, environment: {} };

    for (const [scopePath, scopedEnvironment] of Object.entries(pluginData.environment)) {
        if (scopePath && scopedEnvironment) {
            const resultSymbols: {
                [symbolName in string]?: ResultDeclaredSymbol;
            } = {};

            for (const [symbolName, declaredSymbol] of Object.entries(scopedEnvironment.symbols)) {
                if (symbolName && declaredSymbol) {
                    resultSymbols[symbolName] =
                        declaredSymbol.type === 'function'
                            ? ({ ...declaredSymbol, argDefinition: null } as ResultFunctionSymbol)
                            : declaredSymbol;
                }
            }

            const resultScopedEnvironment: ResultScopedEnvironment = {
                ...scopedEnvironment,
                symbols: resultSymbols
            };

            resultPluginData.environment[scopePath] = resultScopedEnvironment;
        }
    }

    return resultPluginData;
};
