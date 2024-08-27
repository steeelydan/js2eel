import { useEffect, useRef } from 'preact/hooks';
import { Js2Eel } from './js2eel/Js2Eel';
import { useAppStore } from '../zustand/appStore';
import { useJs2EelStore } from '../zustand/js2eelStore';

import type { VNode } from 'preact';
import type { AppEnvironment, WrappedCompileResult } from '../types';
import type { Js2EelStorage } from '../storage/Js2EelStorage';
import { loadExpandedTreeNodes, saveExpandedTreeNodes } from '../storage/persistedViewState';

type Props = {
    initialStorage: Js2EelStorage;
    environment: AppEnvironment;
    onCompile: (filePath: string, jsSrc: string) => Promise<WrappedCompileResult | null>;
};

export const EditorApp = ({ initialStorage, environment, onCompile }: Props): VNode | null => {
    const setEnvironment = useAppStore((state) => state.setEnvironment);
    const dark = useAppStore((state) => state.dark);
    const setDark = useAppStore((state) => state.setDark);
    const appScreen = useAppStore((state) => state.appScreen);
    const setAppScreen = useAppStore((state) => state.setAppScreen);
    const expandedTreeNodes = useAppStore((state) => state.expandedTreeNodes);
    const setExpandedTreeNodes = useAppStore((state) => state.setExpandedTreeNodes);
    const storage = useJs2EelStore((state) => state.storage);
    const setStorage = useJs2EelStore((state) => state.setStorage);
    const setOnCompile = useJs2EelStore((state) => state.setOnCompile);
    const compileResult = useJs2EelStore((state) => state.compileResult);
    const currentFile = useJs2EelStore((state) => state.currentFile);

    const expandedTreeNodesRef = useRef(expandedTreeNodes);
    const lastTickRef = useRef<number>(Date.now());

    useEffect(() => {
        expandedTreeNodesRef.current = expandedTreeNodes;
    });

    // Settings
    useEffect(() => {
        if (environment && onCompile && initialStorage) {
            setEnvironment(environment);
            setOnCompile(onCompile);
            if (!storage) {
                setStorage(initialStorage);
            }
            setDark(false);
            setAppScreen('js2eel');
        }
    }, [
        environment,
        setEnvironment,
        setDark,
        setAppScreen,
        setOnCompile,
        onCompile,
        initialStorage,
        storage,
        setStorage
    ]);

    // Load expanded tree nodes from local storage
    useEffect(() => {
        if (compileResult && currentFile) {
            const load = async (): Promise<void> => {
                const fileExpandedTreeNodes = await loadExpandedTreeNodes(
                    currentFile.absoluteFilePath
                );

                if (fileExpandedTreeNodes) {
                    setExpandedTreeNodes(fileExpandedTreeNodes);
                } else {
                    const newExpandedTreeNodes = {};
                    setExpandedTreeNodes(newExpandedTreeNodes);
                    await saveExpandedTreeNodes(currentFile.absoluteFilePath, newExpandedTreeNodes);
                }
            };

            load();
        }
    }, [setExpandedTreeNodes, compileResult, currentFile]);

    // Main tick
    useEffect(() => {
        const tickInterval = setInterval(async () => {
            const currentFileFresh = useJs2EelStore.getState().currentFile;
            if (currentFileFresh && expandedTreeNodesRef.current) {
                await saveExpandedTreeNodes(
                    currentFileFresh.absoluteFilePath,
                    expandedTreeNodesRef.current
                );
            }

            lastTickRef.current = Date.now();
        }, 500);

        return (): void => {
            clearInterval(tickInterval);
        };
    }, []);

    // Warn user if they try to navigate away from the page
    useEffect(() => {
        if (environment === 'webapp') {
            const onBeforeUnload = (): string => {
                return 'Do you want to leave this page? You might lose unsaved changes.';
            };

            window.onbeforeunload = onBeforeUnload;

            return (): void => {
                window.removeEventListener('beforeunload', onBeforeUnload);
            };
        }

        return;
    }, [environment]);

    return dark !== null ? <>{appScreen === 'js2eel' && <Js2Eel />}</> : null;
};
