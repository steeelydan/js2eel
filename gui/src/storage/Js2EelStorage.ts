import type { ListedFile } from '../types';
import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export interface Js2EelStorage {
    getJsFileList: () => Promise<ListedFile[] | null>;
    loadJsSrc: (fileName: string) => Promise<string | null>;
    saveJsSrc: (
        fileName: string,
        src: string,
        setSaved: (saved: boolean) => void
    ) => Promise<boolean>;
    loadDesktopSettings: () => Promise<DesktopSettings | null>;
    saveDesktopSetting: (key: keyof DesktopSettings, value: string) => Promise<boolean>;
}
