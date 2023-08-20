import { getNode } from './getNode';

import type { VNode } from 'preact';
import type { JSONData } from '../../../types';
import { useAppStore } from '../../../zustand/appStore';
import { useMemo } from 'preact/hooks';

type Props = {
    id: string;
    jsonData: JSONData;
};

export const TreeDisplay = ({ id, jsonData }: Props): VNode | null => {
    const expandedTreeNodes = useAppStore((state) => state.expandedTreeNodes);

    const node: VNode[] = useMemo(() => {
        if (jsonData && expandedTreeNodes && id) {
            return Object.entries(jsonData).map(([key, value]) => {
                return getNode(key, value, `/${id}`) || <></>;
            });
        } else {
            return [];
        }
    }, [id, jsonData, expandedTreeNodes]);

    return expandedTreeNodes ? <div>{node}</div> : null;
};
