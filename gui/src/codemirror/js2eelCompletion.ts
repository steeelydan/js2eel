import { autocompletion } from '@codemirror/autocomplete';
import { js2EelCompletionSource } from './completionSources/js2EelCompletionSource';
import { localCompletionSource } from './completionSources/localCompletionSource';

import type { Extension } from '@codemirror/state';

export const js2EelCompletion = (): Extension => {
    const result = autocompletion({ override: [js2EelCompletionSource, localCompletionSource] });

    return result;
};
