import { getFileNameFromFilePath } from '@js2eel/compiler';
import { examples } from '../constants';

import type { ListedFile } from '../types';
import type { Js2EelStorage } from './Js2EelStorage';
import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export class Js2EelDesktopStorage implements Js2EelStorage {
    async getJsFileList(): Promise<ListedFile[] | null> {
        const filePaths: string[] | null = await window.electronAPI.apiJsFileList();

        if (filePaths) {
            const listedFiles: ListedFile[] = filePaths.map((absoluteFilePath: string) => ({
                absoluteFilePath: absoluteFilePath
            }));

            return listedFiles;
        } else {
            return Promise.resolve(null);
        }
    }

    async loadDesktopSettings(): Promise<DesktopSettings | null> {
        return await window.electronAPI.apiLoadSettings();
    }

    async saveDesktopSetting(key: string, value: string): Promise<boolean> {
        const result = await window.electronAPI.apiSaveSetting({ key: key, value: value });

        return result;
    }

    async loadJsSrc(absoluteFilePath: string): Promise<string | null> {
        if (absoluteFilePath.startsWith('example://')) {
            const example = examples.find((example) => example.path === absoluteFilePath);

            return Promise.resolve(example?.src || null);
        }

        return await window.electronAPI.apiLoadJsSrc(getFileNameFromFilePath(absoluteFilePath));
    }

    async saveJsSrc(
        fileName: string,
        src: string,
        setSaved: (saved: boolean) => void
    ): Promise<boolean> {
        const saved = await window.electronAPI.apiSaveJsSrc(fileName, src);

        setSaved(saved);

        return saved;
    }
}
