import { getScopedEnvironmentForScopeId } from './getScopedEnvironmentForScopeId.js';

import type { Js2EelCompiler } from '../index.js';

export const inScope = (scopeId: string, instance: Js2EelCompiler): boolean => {
    return !!getScopedEnvironmentForScopeId(scopeId, instance);
};
