import { useAppStore } from '../../zustand/appStore';
import { COLORS } from '../../constants';

import type { VNode } from 'preact';

type Props = {
    toolbar: VNode;
    editorArea: VNode;
};

export const AppFrame = ({ toolbar, editorArea }: Props): VNode => {
    const dark = useAppStore((state) => state.dark);

    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                overflow: 'hidden',
                flexDirection: 'column',
                color: dark ? COLORS.textDark : COLORS.textLight,
                backgroundColor: dark ? COLORS.bgDark : COLORS.bgLight
            }}
        >
            {toolbar}
            {editorArea}
        </div>
    );
};
