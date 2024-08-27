import { useJs2EelStore } from '../../../zustand/js2eelStore';
import { JsonDisplay } from './JsonDisplay/JsonDisplay';

import type { VNode } from 'preact';
import type { JSONData } from '../../../types';

export const JsAst = (): VNode | null => {
    const compileResult = useJs2EelStore((state) => state.compileResult);

    console.log('compile result', compileResult);

    return compileResult?.tree ? (
        <JsonDisplay
            tree={compileResult.tree as unknown as JSONData}
            dataId="jsAst"
            rawScrollableId="jsAstRaw"
            treeScrollableId="jsAstTree"
        />
    ) : null;
};
