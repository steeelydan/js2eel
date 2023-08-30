import { X } from 'react-feather';

import type { VNode } from 'preact';
import type { ModalName } from '../../types';
import { useEffect } from 'preact/hooks';
import { COLORS } from '../../constants';
import { useJs2EelStore } from '../../zustand/js2eelStore';

type Props = {
    title: string;
    children: VNode | VNode[];
    onOutsideClick: () => void;
    setModalOpen: (modalName: ModalName | null) => void;
};

export const Modal = ({ title, children, onOutsideClick, setModalOpen }: Props): VNode => {
    const setTakeCurrentFileAsTemplate = useJs2EelStore(
        (state) => state.setTakeCurrentFileAsTemplate
    );

    // Escape key closes modal
    useEffect(() => {
        const keyPressHandler = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setModalOpen(null);
                setTakeCurrentFileAsTemplate(false);
            }
        };

        window.addEventListener('keydown', keyPressHandler);

        return () => {
            window.removeEventListener('keydown', keyPressHandler);
        };
    }, [setModalOpen, setTakeCurrentFileAsTemplate]);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                background: 'transparent',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16
            }}
            onMouseDown={onOutsideClick}
        >
            <div
                style={{
                    maxWidth: '850px',
                    maxHeight: '600px',
                    flex: '1 1 600px',
                    height: '100%',
                    background: COLORS.bgLight,
                    boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
                    padding: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3
                }}
                onMouseDown={(event): void => event.stopPropagation()}
            >
                <div
                    style={{
                        height: 26,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16
                    }}
                >
                    <div style={{ fontSize: 'large' }}>{title}</div>
                    <div
                        style={{
                            height: 26,
                            width: 26,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        role="button"
                        onClick={(): void => setModalOpen(null)}
                    >
                        <X style={{ height: 18, width: 18 }} />
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};
