import { examples } from '../constants';
import { JS_LOCAL_STORAGE_PREFIX, getFromLocalStorage, setInLocalStorage } from './localStorage';

import type { ListedFile, LocalStorageSavedFile } from '../types';
import type { Js2EelStorage } from './Js2EelStorage';
import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export class Js2EelBrowserStorage implements Js2EelStorage {
    getJsFileList(): Promise<ListedFile[]> {
        const allLocalStorageItems = { ...localStorage };

        const fileList: ListedFile[] = [];

        for (const [key, value] of Object.entries(allLocalStorageItems)) {
            if (key.startsWith(JS_LOCAL_STORAGE_PREFIX)) {
                fileList.push({ absoluteFilePath: key.slice(JS_LOCAL_STORAGE_PREFIX.length) });
            }
        }

        return Promise.resolve(fileList);
    }

    async loadDesktopSettings(): Promise<DesktopSettings | null> {
        return null;
    }

    async saveDesktopSetting(key: keyof DesktopSettings, value: string): Promise<boolean> {
        return false;
    }

    loadJsSrc(absoluteFilePath: string): Promise<string | null> {
        if (absoluteFilePath.startsWith('example://')) {
            const example = examples.find((example) => example.path === absoluteFilePath);

            return Promise.resolve(example?.src || null);
        }

        const savedFileCandidate = getFromLocalStorage(JS_LOCAL_STORAGE_PREFIX + absoluteFilePath);

        let savedFileSrc = null;
        if (savedFileCandidate) {
            const parsed: LocalStorageSavedFile = JSON.parse(savedFileCandidate);
            savedFileSrc = parsed.src;
        }

        return Promise.resolve(savedFileSrc);
    }

    saveJsSrc(
        absoluteFilePath: string,
        src: string,
        setSaved: (saved: boolean) => void
    ): Promise<boolean> {
        if (absoluteFilePath.startsWith('example://')) {
            return Promise.resolve(false);
        }

        const savedFile: LocalStorageSavedFile = { src: src, modified: new Date().toISOString() };
        const success = setInLocalStorage(
            JS_LOCAL_STORAGE_PREFIX + '/' + absoluteFilePath,
            JSON.stringify(savedFile)
        );
        setSaved(success);

        return Promise.resolve(success);
    }
}
