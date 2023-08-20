import type { VNode } from 'preact';

type Props = {
    children: VNode | VNode[];
};

export const ToolbarFrame = ({ children }: Props): VNode => {
    return (
        <div
            style={{
                margin: '8px 4px 8px 4px',
                display: 'flex',
                flex: '0 0 auto',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none'
            }}
        >
            {children}
        </div>
    );
};
