import { COLORS } from '../../constants';
import { useState } from 'preact/hooks';

import type { VNode } from 'preact';
import type { Icon } from 'react-feather';

type Props = {
    label: string;
    icon: Icon;
    onClick: () => void;
};

export const TileButton = ({ label, icon, onClick }: Props): VNode => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: 140,
                width: 140,
                border: `2px solid ${hovered ? COLORS.textLight : COLORS.tileButtonBorder}`,
                borderRadius: 10,
                margin: 10,
                cursor: 'pointer',
                userSelect: 'none'
            }}
            onMouseEnter={(): void => setHovered(true)}
            onMouseLeave={(): void => setHovered(false)}
            onClick={onClick}
            title={`Go to ${label}`}
        >
            <div style={{ marginBottom: 4 }}>{icon}</div>
            <div>{label}</div>
        </div>
    );
};
