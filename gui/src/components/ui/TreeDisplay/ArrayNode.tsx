import { useState } from 'preact/hooks';
import { getNode } from './getNode';

import type { VNode } from 'preact';
import { ChevronDown, ChevronRight } from 'react-feather';
import { useAppStore } from '../../../zustand/appStore';

type Props = {
    name: string;
    array: unknown[];
    path: string;
};

export const ArrayNode = ({ name, array, path }: Props): VNode => {
    const expandedTreeNodes = useAppStore((state) => state.expandedTreeNodes);
    const expandTreeNode = useAppStore((state) => state.expandTreeNode);
    const collapseTreeNode = useAppStore((state) => state.collapseTreeNode);

    const newPath = path + '/' + name;

    const [localExpanded, setLocalExpanded] = useState(
        expandedTreeNodes ? expandedTreeNodes[newPath] : false
    );

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div
                    style={{
                        width: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={(): void => {
                        setLocalExpanded(!localExpanded);

                        if (!localExpanded) {
                            expandTreeNode(newPath);
                        } else {
                            collapseTreeNode(newPath);
                        }
                    }}
                >
                    {!localExpanded ? <ChevronRight size="12px" /> : <ChevronDown size="12px" />}
                </div>
                <div>
                    {name}:
                    {!localExpanded ? (
                        <>
                            <span>&nbsp;{'[ '}</span>
                            <span style={{ fontSize: '9pt', color: '#aaa' }}>{array.length}</span>
                            <span>{' ]'}</span>
                        </>
                    ) : (
                        <span>&nbsp;{' ['}</span>
                    )}
                </div>
            </div>
            {localExpanded && (
                <>
                    <div style={{ marginLeft: 20 }}>
                        {array.map((item, index) => {
                            return getNode(index.toString(), item, newPath);
                        })}
                        <div>{']'}</div>
                    </div>
                </>
            )}
        </>
    );
};
