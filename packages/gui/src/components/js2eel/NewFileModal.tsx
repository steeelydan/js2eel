import { useState } from 'preact/hooks';
import { useAppStore } from '../../zustand/appStore';
import { getFileNameFromFilePath } from '@js2eel/compiler';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

import type { VNode } from 'preact';
import { useJs2EelStore } from '../../zustand/js2eelStore';

type Props = {
    createNewFile: (absoluteFilePath: string, description: string, src?: string) => Promise<void>;
};

export const NewFileModal = ({ createNewFile }: Props): VNode => {
    const [filename, setFileName] = useState('');
    const [description, setDescription] = useState('');
    const settings = useAppStore((state) => state.desktopSettings);
    const setModalOpen = useAppStore((state) => state.setModalOpen);
    const currentSrc = useJs2EelStore((state) => state.currentSrc);
    const takeCurrentFileAsTemplate = useJs2EelStore((state) => state.takeCurrentFileAsTemplate);
    const setTakeCurrentFileAsTemplate = useJs2EelStore(
        (state) => state.setTakeCurrentFileAsTemplate
    );

    const closeModal = (): void => {
        setModalOpen(null);
        setTakeCurrentFileAsTemplate(false);
    };

    const onCreateNewFile = async (event: MouseEvent): Promise<void> => {
        const path = settings?.inputDir ? `${settings.inputDir}/${filename}.js` : `${filename}.js`;

        if (path) {
            if (takeCurrentFileAsTemplate || description) {
                await createNewFile(
                    getFileNameFromFilePath(path),
                    description,
                    takeCurrentFileAsTemplate ? currentSrc : undefined
                );
                setModalOpen(null);
                setTakeCurrentFileAsTemplate(false);
            }
        }
    };

    return (
        <Modal title="New File" onOutsideClick={closeModal} setModalOpen={setModalOpen}>
            <form id="newFileForm" onSubmit={(event): void => event.preventDefault()}>
                <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'inline-block', width: 150 }} htmlFor="filename">
                        Filename:
                    </label>
                    <input
                        onInput={(event): void =>
                            setFileName((event.target as HTMLInputElement).value)
                        }
                        style={{ marginLeft: 8 }}
                        value={filename}
                        id="filename"
                        autoFocus
                    />
                    .js
                </div>
                {!takeCurrentFileAsTemplate && (
                    <div style={{ marginBottom: 16 }}>
                        <label
                            style={{ display: 'inline-block', width: 150 }}
                            htmlFor="description"
                        >
                            JSFX description:
                        </label>
                        <input
                            style={{ marginLeft: 8 }}
                            onInput={(event): void =>
                                setDescription((event.target as HTMLInputElement).value)
                            }
                            value={description}
                            id="description"
                        />
                    </div>
                )}
                {takeCurrentFileAsTemplate && (
                    <div style={{ marginBottom: 8 }}>
                        The current example file will be the template for the new file.
                    </div>
                )}
                <div style={{ marginBottom: 8 }}>
                    Your JS file will be saved{' '}
                    {settings?.inputDir
                        ? `in ${settings.inputDir}.`
                        : " your browser's local storage."}
                </div>
                {settings?.outputDir ? (
                    <div>Your JSFX file will be saved in {settings.outputDir}.</div>
                ) : (
                    <div>You can download the JSFX file to your computer.</div>
                )}
                <div>
                    <Button
                        type="submit"
                        form="newFileForm"
                        additionalStyles={{ marginTop: '24px' }}
                        onClick={onCreateNewFile}
                        label="Create File"
                    />
                </div>
            </form>
        </Modal>
    );
};
