import { useEffect, useState } from 'preact/hooks';
import { useAppStore } from '../../zustand/appStore';
import { useJs2EelStore } from '../../zustand/js2eelStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { examples } from '../../constants';

import type { VNode } from 'preact';
import type { ListedFile } from '../../types';
import { stripExamplePrefix } from '../../storage/filenameUtils';
import { getFileNameFromFilePath } from '@js2eel/compiler';
import { activateFile } from '../../actions/activateFile';

export const FileSelectorModal = (): VNode => {
    const [jsFileList, setJsFileList] = useState<ListedFile[]>();

    const setModalOpen = useAppStore((state) => state.setModalOpen);
    const setExpandedTreeNodes = useAppStore((state) => state.setExpandedTreeNodes);
    const storage = useJs2EelStore((state) => state.storage);
    const settings = useAppStore((state) => state.desktopSettings);
    const environment = useAppStore((state) => state.environment);

    useEffect(() => {
        if (!storage) {
            return;
        }

        const getFileList = async (): Promise<void> => {
            const allFiles = await storage.getJsFileList();

            if (allFiles) {
                setJsFileList(
                    allFiles.sort((a, b) =>
                        getFileNameFromFilePath(a.absoluteFilePath) <
                        getFileNameFromFilePath(b.absoluteFilePath)
                            ? -1
                            : 1
                    )
                );
            }
        };

        getFileList();
    }, [storage]);

    return (
        <Modal
            title="Open File"
            onOutsideClick={(): void => setModalOpen(null)}
            setModalOpen={setModalOpen}
        >
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    overflow: 'auto',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}
            >
                <div style={{ marginBottom: '16px' }}>Examples:</div>
                {examples.map((example) => (
                    <Button
                        variant="link"
                        additionalStyles={{ marginBottom: '6px' }}
                        key={example.path}
                        label={stripExamplePrefix(example.path)}
                        onClick={async (): Promise<void> => {
                            setExpandedTreeNodes(null);

                            await activateFile(example.src, example.path, true);

                            setModalOpen(null);
                        }}
                    />
                ))}
                {environment === 'desktop' && !settings?.inputDir && (
                    <div style={{ marginTop: 24 }}>
                        Specify an input directory in the settings to load your own files.
                    </div>
                )}
                {jsFileList && jsFileList.length > 0 && (
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '20px',
                            marginBottom: '16px',
                            width: '100%'
                        }}
                    >
                        <div style={{ marginBottom: '16px' }}>Own Files:</div>
                        <div style={{ flex: 1 }}>
                            {jsFileList.map((listedFile) => (
                                <Button
                                    variant="link"
                                    additionalStyles={{ marginBottom: '6px' }}
                                    key={listedFile.absoluteFilePath}
                                    label={getFileNameFromFilePath(listedFile.absoluteFilePath)}
                                    onClick={async (): Promise<void> => {
                                        if (!storage) {
                                            return;
                                        }

                                        const fileSrc = await storage.loadJsSrc(
                                            listedFile.absoluteFilePath
                                        );

                                        if (fileSrc) {
                                            await activateFile(
                                                fileSrc,
                                                listedFile.absoluteFilePath,
                                                false
                                            );

                                            setExpandedTreeNodes(null);
                                            setModalOpen(null);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
