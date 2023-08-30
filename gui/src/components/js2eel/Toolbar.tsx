import { useMemo, useRef } from 'preact/hooks';
import { useAppStore } from '../../zustand/appStore';
import { useJs2EelStore } from '../../zustand/js2eelStore';
import { getEditorContent } from '../../codemirror/editorContent';
import { Check, Copy, Download, FilePlus, Folder, Home, Save, Upload, X } from 'react-feather';
import { ToolbarFrame } from '../layout/ToolbarFrame';
import { Button } from '../ui/Button';
import { stripExamplePrefix } from '../../storage/filenameUtils';
import { COMPILER_VERSION, getFileNameFromFilePath } from '@js2eel/compiler';
import { COLORS } from '../../constants';

import type { VNode } from 'preact';
import { ButtonLink } from '../ui/ButtonLink';

import icon from '../../../public/favicon.png';
import githubMark from '../../../images/github-mark.png';

type Props = {
    createNewFile: (absoluteFilePath: string, description: string, src?: string) => Promise<void>;
};

export const Toolbar = ({ createNewFile }: Props): VNode => {
    const environment = useAppStore((state) => state.environment);
    const settings = useAppStore((state) => state.desktopSettings);
    const dark = useAppStore((state) => state.dark);
    const setModalOpen = useAppStore((state) => state.setModalOpen);
    const setAppScreen = useAppStore((state) => state.setAppScreen);
    const storage = useJs2EelStore((state) => state.storage);
    const currentFile = useJs2EelStore((state) => state.currentFile);
    const compileResult = useJs2EelStore((state) => state.compileResult);
    const jsEditorRef = useJs2EelStore((state) => state.jsEditorRef);
    const saved = useJs2EelStore((state) => state.saved);
    const setSaved = useJs2EelStore((state) => state.setSaved);
    const setTakeCurrentFileAsTemplate = useJs2EelStore(
        (state) => state.setTakeCurrentFileAsTemplate
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    const jsPathDisplay = useMemo(() => {
        return currentFile
            ? environment === 'desktop'
                ? `${
                      currentFile.absoluteFilePath.startsWith('example://') ? '[Example]' : ''
                  } ${stripExamplePrefix(currentFile.absoluteFilePath)}`
                : `${
                      currentFile.absoluteFilePath.startsWith('example://')
                          ? '[Example]'
                          : '[Local Storage]'
                  } ${getFileNameFromFilePath(stripExamplePrefix(currentFile.absoluteFilePath))}`
            : '';
    }, [currentFile, environment]);

    const eelPathDisplay = useMemo(() => {
        return currentFile
            ? environment === 'desktop'
                ? `${settings?.outputDir}/${stripExamplePrefix(
                      getFileNameFromFilePath(currentFile.absoluteFilePath).slice(0, -3)
                  )}.jsfx`
                : `${getFileNameFromFilePath(
                      stripExamplePrefix(currentFile.absoluteFilePath.slice(0, -3))
                  )}.jsfx`
            : '';
    }, [currentFile, environment, settings?.outputDir]);

    const shortenedJsPathDisplay =
        jsPathDisplay.length > 50
            ? `${jsPathDisplay.slice(0, 20)}...${jsPathDisplay.slice(-25)}`
            : jsPathDisplay;
    const shortenedEelPathDisplay =
        eelPathDisplay.length > 50
            ? `${eelPathDisplay.slice(0, 20)}...${eelPathDisplay.slice(-25)}`
            : eelPathDisplay;

    return (
        <ToolbarFrame>
            <input
                onChange={async (event): Promise<void> => {
                    if (event && event.target) {
                        const files = (event.target as HTMLInputElement).files;

                        if (files && files[0].name.endsWith('.js')) {
                            let absoluteFilePath = '';

                            if (settings?.inputDir) {
                                absoluteFilePath += settings.inputDir;
                            }

                            absoluteFilePath += '/' + files[0].name;

                            const fileReader = new FileReader();

                            fileReader.onload = async (): Promise<void> => {
                                const content = fileReader.result;
                                if (typeof content === 'string') {
                                    await createNewFile(
                                        getFileNameFromFilePath(absoluteFilePath),
                                        'Imported JS2EEL Plugin',
                                        content
                                    );
                                }
                            };

                            fileReader.readAsText(files[0]);
                        }
                    }
                }}
                type="file"
                accept=".js"
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', flex: '0 0 50%' }}>
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {environment === 'webapp' && (
                            <img style={{ width: 20, height: 20, marginRight: 8 }} src={icon} alt="JS2EEL Logo" />
                        )}
                        {environment === 'desktop' && (
                            <Button
                                title="Home"
                                icon={<Home size={14} />}
                                onClick={async (): Promise<void> => {
                                    await setAppScreen('home');
                                }}
                                additionalStyles={{ marginRight: '12px' }}
                            />
                        )}
                        <div style={{ marginRight: 24 }}>JS2EEL v{COMPILER_VERSION}</div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: 12
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: 16,
                                paddingTop: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {saved ? null : (
                                <div
                                    style={{
                                        height: 5,
                                        width: 5,
                                        marginBottom: 1,
                                        background: dark ? COLORS.textDark : COLORS.textLight,
                                        borderRadius: '100%'
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ marginRight: 16 }} title={jsPathDisplay}>
                            {shortenedJsPathDisplay}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                width: 16,
                                paddingTop: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title={
                                compileResult?.success
                                    ? 'Compiled successfully'
                                    : 'Compiled with errors'
                            }
                        >
                            {compileResult?.success ? (
                                <Check style={{ color: COLORS.success }} />
                            ) : (
                                <X style={{ color: COLORS.error }} />
                            )}
                        </div>
                        <Button
                            icon={<Save size={13} />}
                            title="Save"
                            onClick={async (): Promise<void> => {
                                if (storage && currentFile && jsEditorRef.current) {
                                    if (!currentFile.isExample) {
                                        storage.saveJsSrc(
                                            getFileNameFromFilePath(currentFile.absoluteFilePath),
                                            getEditorContent(jsEditorRef.current),
                                            setSaved
                                        );
                                    } else {
                                        setTakeCurrentFileAsTemplate(true);
                                        setModalOpen('newFile');
                                    }
                                }
                            }}
                            additionalStyles={{ marginLeft: '18px', marginRight: '8px' }}
                        />
                        <Button
                            icon={<Folder size={13} />}
                            title="Open"
                            onClick={(): void => setModalOpen('openFile')}
                            additionalStyles={{ marginRight: '8px' }}
                        />
                        <Button
                            icon={<FilePlus size={13} />}
                            title="New file"
                            onClick={(): void => {
                                setModalOpen('newFile');
                            }}
                            additionalStyles={{ marginRight: '8px' }}
                        />
                        <Button
                            icon={<Copy size={13} />}
                            title="Copy to clipboard"
                            onClick={(): Promise<void> =>
                                navigator.clipboard.writeText(
                                    jsEditorRef.current ? getEditorContent(jsEditorRef.current) : ''
                                )
                            }
                            additionalStyles={{ marginRight: '8px' }}
                        />
                        <Button
                            icon={<Upload size={13} />}
                            title="Upload"
                            onClick={(): void => {
                                fileInputRef.current?.click();
                            }}
                            additionalStyles={{ marginRight: '8px' }}
                        />
                        <ButtonLink
                            href={`data:${
                                'text/json;charset=utf-8,' +
                                encodeURIComponent(
                                    jsEditorRef.current ? getEditorContent(jsEditorRef.current) : ''
                                )
                            }`}
                            title="Download"
                            icon={<Download size={13} />}
                            download={compileResult?.name + '.js'}
                            style={{ marginRight: '8px' }}
                        />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flex: '0 0 50%', justifyContent: 'flex-end' }}>
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div></div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: 12
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{ marginRight: 14 }} title={eelPathDisplay}>
                                {shortenedEelPathDisplay}
                            </div>
                        </div>
                        <Button
                            icon={<Copy size={13} />}
                            title="Copy to clipboard"
                            onClick={(): Promise<void> =>
                                navigator.clipboard.writeText(compileResult?.src || '')
                            }
                            additionalStyles={{ marginRight: '8px' }}
                        />
                        <ButtonLink
                            title="Download"
                            href={`data:${
                                'text/json;charset=utf-8,' +
                                encodeURIComponent(compileResult?.src || '')
                            }`}
                            style={{ marginRight: '8px' }}
                            download={compileResult?.name + '.jsfx'}
                            icon={<Download size={13} />}
                        />
                        <div
                            style={{
                                paddingLeft: 18,
                                marginLeft: 6,
                                borderLeft: `1px solid ${COLORS.borderIntense}`
                            }}
                        >
                            <a
                                href="https://github.com/steeelydan/js2eel"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                aria-label="Link to the JS2EEL GitHub Repository"
                            >
                                <img style={{ width: 18, height: 18 }} src={githubMark} alt="Link to GitHub" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ToolbarFrame>
    );
};
