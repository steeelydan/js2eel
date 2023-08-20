import { TreeDisplay } from '../../../ui/TreeDisplay/TreeDisplay';

import type { VNode } from 'preact';
import type { JSONData } from '../../../../types';
import { RawSwitch } from './RawSwitch';
import { useEffect, useState } from 'preact/hooks';
import { PersistedScrollable } from '../PersistedScrollable';
import { JsonReadonlyCodeEditor } from '../JsonReadonlyCodeEditor';
import { useJs2EelStore } from '../../../../zustand/js2eelStore';
import { loadCurrentTabView } from '../../../../storage/persistedViewState';

type Props = {
    tree: JSONData;
    dataId: string;
    rawScrollableId: string;
    treeScrollableId: string;
};

export const JsonDisplay = ({ tree, dataId, rawScrollableId, treeScrollableId }: Props): VNode => {
    const [raw, setRaw] = useState<boolean | null>(null);
    const currentFilePath = useJs2EelStore((state) => state.currentFile)?.absoluteFilePath;

    // Get raw / tree state from local storage
    useEffect(() => {
        const load = async (): Promise<void> => {
            if (currentFilePath) {
                const currentTabView = await loadCurrentTabView(currentFilePath, dataId);

                setRaw(currentTabView === 'raw' ? true : false);
            }
        };

        load();
    }, [dataId, currentFilePath]);

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <RawSwitch dataId={dataId} raw={raw} setRaw={setRaw} />
            {raw === true ? (
                <JsonReadonlyCodeEditor
                    scrollId={rawScrollableId}
                    content={JSON.stringify(tree, null, 4)}
                />
            ) : raw === false ? (
                <PersistedScrollable scrollableId={treeScrollableId}>
                    <pre style={{ padding: '8px' }}>
                        <TreeDisplay id={dataId} jsonData={tree as unknown as JSONData} />
                    </pre>
                </PersistedScrollable>
            ) : null}
        </div>
    );
};
