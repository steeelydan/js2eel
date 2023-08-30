import { useCallback, useEffect } from 'preact/hooks';
import { useAppStore } from '../../zustand/appStore';
import { useJs2EelStore } from '../../zustand/js2eelStore';
import { loadClientSetting, saveClientSetting } from '../../storage/clientSettings';
import { AppFrame } from '../layout/AppFrame';
import { Toolbar } from './Toolbar';
import { TabSelectors } from './TabSelectors';
import { JsAst } from './tabs/JsAst';
import { PluginData } from './tabs/PluginData';
import { JsCodeEditor } from './tabs/JsCodeEditor';
import { EelReadonlyCodeEditor } from './tabs/EelReadonlyCodeEditor';
import { Docs } from './tabs/Docs/Docs';
import { NewFileModal } from './NewFileModal';
import { FileSelectorModal } from './FileSelectorModal';
import { EXAMPLE_VOLUME_JS } from './examples/01_volume';
import { getDefaultNewFile } from './examples/getDefaultNewFile';
import { activateFile } from '../../actions/activateFile';
import { getFileNameFromFilePath } from '@js2eel/compiler';
import { saveExpandedTreeNodes } from '../../storage/persistedViewState';

import type { VNode } from 'preact';
import type { Js2EelLeftTab, Js2EelRightTab } from '../../types';

export const Js2Eel = (): VNode => {
    const settings = useAppStore((state) => state.desktopSettings);
    const setHasSeenHelp = useAppStore((state) => state.setHasSeenHelp);
    const storage = useJs2EelStore((state) => state.storage);
    const modalOpen = useAppStore((state) => state.modalOpen);
    const setCurrentFile = useJs2EelStore((state) => state.setCurrentFile);
    const leftTab = useJs2EelStore((state) => state.leftTab);
    const setLeftTab = useJs2EelStore((state) => state.setLeftTab);
    const rightTab = useJs2EelStore((state) => state.rightTab);
    const setRightTab = useJs2EelStore((state) => state.setRightTab);
    const setSaved = useJs2EelStore((state) => state.setSaved);
    const setExpandedTreeNodes = useAppStore((state) => state.setExpandedTreeNodes);

    const jsEditorRef = useJs2EelStore((state) => state.jsEditorRef);
    // const eelEditorRef = useJs2EelStore((state) => state.eelEditorRef);

    useEffect(() => {
        if (storage) {
            const fetchClientSettings = async (): Promise<void> => {
                const savedCurrentLeftTab = await loadClientSetting('currentLeftTab');
                setLeftTab((savedCurrentLeftTab as Js2EelLeftTab) || 'jsCode');

                const savedCurrentRightTab = await loadClientSetting('currentRightTab');
                setRightTab((savedCurrentRightTab as Js2EelRightTab) || 'eelCode');

                const hasSeenHelp = await loadClientSetting('hasSeenHelp');
                setHasSeenHelp(!!hasSeenHelp);
            };

            fetchClientSettings();
        }
    }, [storage, setLeftTab, setRightTab, setHasSeenHelp]);

    const createNewFile = useCallback(
        async (fileName: string, description: string, src?: string): Promise<void> => {
            const absoluteFilePath = settings ? settings.inputDir + '/' + fileName : '/' + fileName;

            if (storage && jsEditorRef.current) {
                setCurrentFile({
                    fileName: fileName,
                    absoluteFilePath: absoluteFilePath,
                    isExample: false
                });
                const newFileSrc = src || getDefaultNewFile(description);
                await storage.saveJsSrc(
                    getFileNameFromFilePath(absoluteFilePath),
                    newFileSrc,
                    setSaved
                );
                await activateFile(newFileSrc, absoluteFilePath, false);

                setExpandedTreeNodes(null);

                await saveExpandedTreeNodes(absoluteFilePath, null);
            }
        },
        [setCurrentFile, setSaved, storage, settings, jsEditorRef, setExpandedTreeNodes]
    );

    useEffect(() => {
        if (!storage) {
            return;
        }

        const loadLastFile = async (): Promise<void> => {
            const savedCurrentFilePath = await loadClientSetting('currentFilePath');

            if (savedCurrentFilePath) {
                const savedFileSrc = await storage.loadJsSrc(savedCurrentFilePath);

                if (savedFileSrc) {
                    await activateFile(
                        savedFileSrc,
                        savedCurrentFilePath,
                        savedCurrentFilePath.startsWith('example://')
                    );
                } else {
                    await activateFile(EXAMPLE_VOLUME_JS.src, EXAMPLE_VOLUME_JS.path, true);
                }
            } else {
                await activateFile(EXAMPLE_VOLUME_JS.src, EXAMPLE_VOLUME_JS.path, true);
            }
        };

        loadLastFile();
    }, [storage]);

    return (
        <>
            <AppFrame
                toolbar={<Toolbar createNewFile={createNewFile} />}
                editorArea={
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            flex: '1 1 auto',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: '1px solid gray',
                                borderRight: '1px solid gray',
                                width: '50%',
                                height: '100%'
                            }}
                        >
                            {leftTab && (
                                <>
                                    <TabSelectors side="left" />
                                    {leftTab === 'jsCode' && <JsCodeEditor />}
                                    {leftTab === 'jsAst' && <JsAst />}
                                    {leftTab === 'pluginData' && <PluginData />}
                                </>
                            )}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: '1px solid gray',
                                width: '50%',
                                height: '100%'
                            }}
                        >
                            {rightTab && (
                                <>
                                    <TabSelectors side="right" />
                                    {rightTab === 'eelCode' && <EelReadonlyCodeEditor />}
                                    {rightTab === 'docs' && <Docs />}
                                </>
                            )}
                        </div>
                    </div>
                }
            />
            {modalOpen === 'openFile' && <FileSelectorModal />}
            {modalOpen === 'newFile' && <NewFileModal createNewFile={createNewFile} />}
        </>
    );
};
