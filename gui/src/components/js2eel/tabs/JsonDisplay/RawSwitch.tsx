import type { VNode } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../../ui/Button';
import { useJs2EelStore } from '../../../../zustand/js2eelStore';
import { saveCurrentTabView } from '../../../../storage/persistedViewState';

type Props = {
    dataId: string;
    raw: boolean | null;
    setRaw: (raw: boolean) => void;
};

export const RawSwitch = ({ dataId, raw, setRaw }: Props): VNode => {
    const [hovered, setHovered] = useState(false);
    const currentFilePath = useJs2EelStore((state) => state.currentFile)?.absoluteFilePath;

    return (
        <div
            style={{
                position: 'absolute',
                opacity: hovered ? 1 : 0.4,
                padding: '3px 5px 3px 5px',
                borderRadius: '4px',
                top: 0,
                right: 17,
                zIndex: 100
            }}
            onMouseEnter={(): void => setHovered(true)}
            onMouseLeave={(): void => setHovered(false)}
        >
            <Button
                label={raw ? 'Tree' : 'Raw'}
                additionalStyles={{ backgroundColor: '#aaa' }}
                additionalHoverStyles={{ backgroundColor: '#aaa' }}
                onClick={async (): Promise<void> => {
                    if (!currentFilePath) return;

                    if (raw) {
                        setRaw(false);
                        await saveCurrentTabView(currentFilePath, false, dataId);
                    } else {
                        setRaw(true);
                        await saveCurrentTabView(currentFilePath, true, dataId);
                    }
                }}
            />
        </div>
    );
};
