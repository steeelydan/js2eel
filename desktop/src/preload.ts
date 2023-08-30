import { contextBridge, ipcRenderer } from 'electron';

import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

contextBridge.exposeInMainWorld('electronAPI', {
    apiJsFileList: () => ipcRenderer.invoke('apiJsFileList'),
    apiLoadSettings: () => ipcRenderer.invoke('apiLoadSettings'),
    apiSaveSetting: (body: { key: keyof DesktopSettings; value: string }) =>
        ipcRenderer.invoke('apiSaveSetting', body),
    apiLoadJsSrc: (fileName: string) => ipcRenderer.invoke('apiLoadJsSrc', fileName),
    apiSaveJsSrc: (fileName: string, content: string) =>
        ipcRenderer.invoke('apiSaveJsSrc', fileName, content),
    apiJsCompile: (filePath: string, jsSrc: string) =>
        ipcRenderer.invoke('apiJsCompile', filePath, jsSrc),
    openDirectory: (defaultPath: string | null | undefined) =>
        ipcRenderer.invoke('dialog:openDirectory', defaultPath),
    showDirInFileBrowser: (dirPath: string) => ipcRenderer.invoke('showDirInFileBrowser', dirPath)
});
