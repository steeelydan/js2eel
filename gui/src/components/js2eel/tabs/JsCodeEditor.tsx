import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { getEditorContent } from '../../../codemirror/editorContent';

import { getFileNameFromFilePath } from '@js2eel/compiler';
import { useJs2EelStore } from '../../../zustand/js2eelStore';

import type { VNode } from 'preact';
import type { ViewUpdate } from '@codemirror/view';
import type { Diagnostic } from '@codemirror/lint';
import { COLORS } from '../../../constants';
import { jsCodeMirror } from '../../../codemirror/jsCodeMirror';
import { useRecallScrollPosition } from '../useRecallScrollPosition';
import { formatCode } from '../../../actions/formatCode';
import { useAppStore } from '../../../zustand/appStore';

export const JsCodeEditor = (): VNode => {
    const setModalOpen = useAppStore((state) => state.setModalOpen);
    const setTakeCurrentFileAsTemplate = useJs2EelStore(
        (state) => state.setTakeCurrentFileAsTemplate
    );
    const compileResult = useJs2EelStore((state) => state.compileResult);
    const setCompileResult = useJs2EelStore((state) => state.setCompileResult);
    const compileDuration = useJs2EelStore((state) => state.compileDuration);
    const setCompileDuration = useJs2EelStore((state) => state.setCompileDuration);
    const currentFile = useJs2EelStore((state) => state.currentFile);
    const onCompile = useJs2EelStore((state) => state.onCompile);
    const storage = useJs2EelStore((state) => state.storage);
    const currentSrc = useJs2EelStore((state) => state.currentSrc);
    const setCurrentSrc = useJs2EelStore((state) => state.setCurrentSrc);
    const jsEditorRef = useJs2EelStore((state) => state.jsEditorRef);
    const saved = useJs2EelStore((state) => state.saved);
    const setSaved = useJs2EelStore((state) => state.setSaved);
    const [esLintErrors, setEslintErrors] = useState<Diagnostic[]>([]);

    const jsCompileTimeoutRef = useRef<NodeJS.Timeout>();
    const jsEditorElRef = useRef<HTMLDivElement>(null);
    const currentFileRef = useRef(currentFile);
    const currentSrcRef = useRef(currentSrc);
    const compileResultRef = useRef(compileResult);
    const savedRef = useRef(saved);
    const lastFilePathRef = useRef('');

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [scrollId, setScrollId] = useState<string>();

    // FIXME change to use PersistedScrollable
    useRecallScrollPosition(scrollContainerRef, scrollId);

    useEffect(() => {
        currentFileRef.current = currentFile;
        currentSrcRef.current = currentSrc;
        compileResultRef.current = compileResult;
        savedRef.current = saved;
    });

    const onEditDelayDone = useCallback(
        async (update: ViewUpdate): Promise<void> => {
            const currentDoc = update.state.doc.toString();

            if (onCompile && currentDoc !== currentSrcRef.current && currentFileRef.current) {
                setCurrentSrc(currentDoc);

                if (lastFilePathRef.current !== currentFileRef.current.absoluteFilePath) {
                    lastFilePathRef.current = currentFileRef.current.absoluteFilePath;
                } else {
                    if (savedRef.current && !currentFileRef.current.isExample) {
                        setSaved(false);
                    }
                }

                const compileResult = await onCompile(
                    currentFileRef.current.absoluteFilePath,
                    currentDoc
                );

                if (compileResult?.result) {
                    setCompileResult(compileResult.result);
                    setCompileDuration(compileResult.compileTime);
                }
            }
        },
        [onCompile, setCompileDuration, setCompileResult, setCurrentSrc, setSaved]
    );

    const onEditorUpdate = useCallback(
        (update: ViewUpdate): void => {
            clearTimeout(jsCompileTimeoutRef.current);

            jsCompileTimeoutRef.current = setTimeout(() => onEditDelayDone(update), 200);
        },
        [onEditDelayDone]
    );

    // Keyboard shortcuts
    useEffect(() => {
        const onKeyPress = async (event: KeyboardEvent): Promise<void> => {
            if (event.key === 's' && event.ctrlKey) {
                event.preventDefault();

                if (storage && currentFile && jsEditorRef.current) {
                    if (!currentFile.isExample) {
                        await storage.saveJsSrc(
                            getFileNameFromFilePath(currentFile.absoluteFilePath),
                            getEditorContent(jsEditorRef.current),
                            setSaved
                        );
                    } else {
                        setTakeCurrentFileAsTemplate(true);
                        setModalOpen('newFile');
                    }
                }
            }
        };

        document.addEventListener('keydown', onKeyPress);

        return (): void => {
            document.removeEventListener('keydown', onKeyPress);
        };
    }, [currentFile, jsEditorRef, storage, setSaved, setModalOpen, setTakeCurrentFileAsTemplate]);

    // Init editor
    useEffect(() => {
        if (!jsEditorElRef.current) {
            return;
        }

        jsEditorRef.current = jsCodeMirror(
            currentSrcRef,
            compileResultRef,
            jsEditorElRef,
            onEditorUpdate,
            setEslintErrors
        );

        scrollContainerRef.current = jsEditorElRef.current.querySelector('.cm-scroller');
        setScrollId('jsCodeEditor');

        return (): void => {
            if (jsCompileTimeoutRef.current) {
                clearTimeout(jsCompileTimeoutRef.current);
            }

            jsEditorRef.current?.destroy();
        };
    }, [jsEditorRef, onEditorUpdate]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    width: '100%',
                    flex: '1 1 auto',
                    overflow: 'auto',
                    scrollBehavior: 'smooth',
                    minHeight: 100
                }}
                onKeyDown={async (event): Promise<void> => {
                    if (event.key === 'I' && event.ctrlKey) {
                        if (!jsEditorRef.current) {
                            return;
                        }

                        event.preventDefault();

                        await formatCode(jsEditorRef.current);
                    }
                }}
                ref={jsEditorElRef}
            ></div>
            <div
                style={{
                    borderTop: '1px solid gray',
                    padding: 8,
                    flex: '0 0 25%',
                    minHeight: 100,
                    overflow: 'auto',
                    fontFamily: 'Hack',
                    fontSize: '9.5pt'
                }}
            >
                <>
                    {esLintErrors.length ? (
                        <>
                            {esLintErrors.map((lintError, index) => {
                                let message: string | VNode = lintError.message;

                                if (message.includes('Parsing error:')) {
                                    message = (
                                        <>
                                            <span key={'a'} style={{ color: COLORS.error }}>
                                                Parsing error:&nbsp;
                                            </span>
                                            <span key={'b'}>{message.slice(15)}</span>
                                        </>
                                    );
                                } else {
                                    message = (
                                        <>
                                            <span style={{ color: COLORS.error }}>
                                                Parsing error:&nbsp;
                                            </span>
                                            <span>{message}</span>
                                        </>
                                    );
                                }

                                return (
                                    <div key={index}>
                                        Line{' '}
                                        {
                                            jsEditorRef.current?.state.doc.lineAt(
                                                lintError.from <=
                                                    jsEditorRef.current.state.doc.length
                                                    ? lintError.from
                                                    : jsEditorRef.current.state.doc.length
                                            ).number
                                        }
                                        : {message}
                                    </div>
                                );
                            })}
                        </>
                    ) : null}
                    {compileResult?.errors?.length || !compileResult?.success ? (
                        <>
                            Compiled with errors in {compileDuration?.toFixed(1)} ms
                            <br />
                        </>
                    ) : null}
                    {compileResult?.errors?.length ? (
                        <>
                            {compileResult.errors.length} error
                            {compileResult.errors.length > 1 && 's'}
                            <br />
                            {compileResult?.errors
                                // .filter((error, index) => {
                                //     // Get rid of duplicate errors because of eachChannel()

                                //     if (!compileResult.errors[index - 1]) {
                                //         return true;
                                //     }

                                //     return (
                                //         error.msg !== compileResult.errors[index - 1].msg ||
                                //         error.node?.loc?.start.line !==
                                //             compileResult.errors[index - 1].node?.loc?.start.line
                                //     );
                                // })
                                .map((error, index) => (
                                    <div key={index}>
                                        {error.node?.loc?.start.line && (
                                            <>Line {error.node?.loc?.start.line}: </>
                                        )}
                                        <span style={{ color: COLORS.error }}>{error.type}:</span>{' '}
                                        {error.msg}
                                    </div>
                                ))}
                        </>
                    ) : !esLintErrors.length ? (
                        <>Compiled without errors in {compileDuration?.toFixed(1)} ms</>
                    ) : (
                        ''
                    )}
                    {compileResult?.warnings?.length ? (
                        <>
                            {compileResult?.warnings.map((warning, index) => (
                                <div key={index}>
                                    {warning.node?.loc?.start.line && (
                                        <>Line {warning.node?.loc?.start.line}: </>
                                    )}
                                    <span style={{ color: COLORS.warning }}>{warning.type}:</span>{' '}
                                    {warning.msg}
                                </div>
                            ))}
                        </>
                    ) : null}
                </>
            </div>
        </div>
    );
};
