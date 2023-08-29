import { useEffect } from 'preact/hooks';
import { EditorApp } from './EditorApp';
import { useAppStore } from '../zustand/appStore';
import { useJs2EelStore } from '../zustand/js2eelStore';
import { loadClientSetting } from '../storage/clientSettings';
import { Js2EelDesktopStorage } from '../storage/Js2EelDesktopStorage';
import { DesktopHome } from './desktop/DesktopHome';
import { DirInputScreen } from './desktop/DirInputScreen';
import { DesktopSettings } from './desktop/DesktopSettings';

import type { VNode } from 'preact';
import type { AppScreen, WrappedCompileResult } from '../types';
import type { CompileResult } from '@js2eel/compiler/dist/types/js2eel/types';

const storage = new Js2EelDesktopStorage();

const onCompile = async (filePath: string, jsSrc: string): Promise<WrappedCompileResult | null> => {
    if (filePath === undefined || filePath === null || jsSrc === undefined || jsSrc === null) {
        console.error(
            `onCompile() called with invalid arguments. filePath: ${filePath}, jsSrc: ${jsSrc.slice(
                0,
                100
            )}...`
        );

        return null;
    }

    const now = performance.now();

    let compileResult: CompileResult | null = null;

    try {
        compileResult = await window.electronAPI.apiJsCompile(filePath, jsSrc);
    } catch (e) {
        console.error(e);
    }

    const compileTime = performance.now() - now;

    return compileResult
        ? {
              result: compileResult,
              compileTime: compileTime
          }
        : null;
};

export const DesktopApp = (): VNode | null => {
    const appScreen = useAppStore((state) => state.appScreen);
    const setAppScreen = useAppStore((state) => state.setAppScreen);
    const setStorage = useJs2EelStore((state) => state.setStorage);
    const setSettings = useAppStore((state) => state.setDesktopSettings);
    const settings = useAppStore((state) => state.desktopSettings);

    useEffect(() => {
        const fetchSettings = async (): Promise<void> => {
            const savedSettings = await storage.loadDesktopSettings();

            if (savedSettings) {
                setSettings(savedSettings);
            }
        };

        fetchSettings();
    }, [setSettings]);

    useEffect(() => {
        const getClientSettings = async (): Promise<void> => {
            const potentialSavedAppScreen: AppScreen | null = (await loadClientSetting(
                'screen'
            )) as AppScreen | null;

            if (potentialSavedAppScreen) {
                setAppScreen(potentialSavedAppScreen);
            }
        };

        getClientSettings();

        setStorage(storage);
    }, [setAppScreen, setStorage]);

    const dirsDefined = settings?.inputDir && settings?.outputDir;

    return settings ? (
        !dirsDefined ? (
            <DirInputScreen />
        ) : appScreen === 'home' || !appScreen ? (
            <DesktopHome />
        ) : appScreen === 'js2eel' ? (
            <EditorApp environment="desktop" initialStorage={storage} onCompile={onCompile} />
        ) : appScreen === 'settings' ? (
            <DesktopSettings />
        ) : null
    ) : null;
};
