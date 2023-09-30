import type {
    DeclaredSymbol,
    PluginData,
    ResultDeclaredSymbol,
    ResultFunctionAssignment,
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
                        declaredSymbol.currentAssignment?.type === 'function'
                            ? {
                                  ...(declaredSymbol as DeclaredSymbol),
                                  currentAssignment: {
                                      ...declaredSymbol.currentAssignment,
                                      argDefinition: null
                                  } as ResultFunctionAssignment
                              }
                            : (declaredSymbol as ResultDeclaredSymbol);
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
