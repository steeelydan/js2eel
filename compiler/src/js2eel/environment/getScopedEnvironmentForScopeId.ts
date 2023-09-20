import { getLastScopePathSeparator } from '../../shared/shared.js';

import type { Js2EelCompiler } from '../compiler/Js2EelCompiler.js';
import type { ScopedEnvironment } from '../types.js';

export const getScopedEnvironmentForScopeId = (
    scopeId: string,
    instance: Js2EelCompiler
): ScopedEnvironment | null => {
    let scopedEnvironment: ScopedEnvironment | undefined;

    let currentScopePath = instance.getCurrentScopePath();

    const environment = instance.getScopeRegister();

    while (currentScopePath !== 'roo') {
        scopedEnvironment =
            environment[currentScopePath]?.scopeId === scopeId
                ? environment[currentScopePath]
                : undefined;

        if (scopedEnvironment) {
            break;
        }

        const cutIndex = getLastScopePathSeparator(currentScopePath);

        currentScopePath = currentScopePath.slice(0, cutIndex);
    }

    return scopedEnvironment ? scopedEnvironment : null;
};
