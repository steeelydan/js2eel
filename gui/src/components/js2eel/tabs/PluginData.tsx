import { useJs2EelStore } from '../../../zustand/js2eelStore';

import type { VNode } from 'preact';
import { JsonDisplay } from './JsonDisplay/JsonDisplay';

export const PluginData = (): VNode | null => {
    const compileResult = useJs2EelStore((state) => state.compileResult);

    return compileResult?.pluginData ? (
        <JsonDisplay
            tree={compileResult.pluginData}
            dataId="pluginData"
            rawScrollableId="pluginDataRaw"
            treeScrollableId="pluginDataTree"
        />
    ) : null;
};
