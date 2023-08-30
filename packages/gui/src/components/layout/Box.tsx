import type { VNode } from 'preact';

type Props = {
    children: VNode | VNode[] | null;
    border?: { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean };
    padding?: 'large' | 'small';
    scroll?: boolean;
    height?: string;
};

export const Box = ({ children, border, padding, scroll, height }: Props): VNode => {
    return (
        <div
            style={{
                borderTop: border?.top ? '1px solid gray' : undefined,
                borderRight: border?.right ? '1px solid gray' : undefined,
                borderBottom: border?.bottom ? '1px solid gray' : undefined,
                borderLeft: border?.left ? '1px solid gray' : undefined,
                height: height || '100%',
                width: '100%',
                flex: '0 1 100%',
                display: 'flex',
                flexDirection: 'column',
                padding: padding === 'large' ? '12px' : padding === 'small' ? '8px' : undefined,
                overflow: scroll ? 'auto' : undefined
            }}
        >
            {children}
        </div>
    );
};
