import type { VNode } from 'preact';

type Props = {
    children: VNode | VNode[];
};

export const EditorAreaFrame = ({ children }: Props): VNode => {
    return <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>{children}</div>;
};
