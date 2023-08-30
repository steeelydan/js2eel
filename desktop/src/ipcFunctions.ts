import fs from 'fs';
import path from 'path';
import { dialog, shell } from 'electron';

import { Js2EelCompiler } from '@js2eel/compiler';
import { loadSettingsFile, saveSetting } from './utils/fileUtils';
import { compileJs } from './compileJs';
import { getAllJsFilePaths } from './dataAccess/dataAccess';
import { APP_USER_DATA_DIR, LOCAL_OUTPUTS_DIR, SETTINGS_FILE_NAME } from './constants';

import type { IpcMainInvokeEvent } from 'electron';
import type { CompileResult, DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

if (!fs.existsSync(APP_USER_DATA_DIR)) {
    fs.mkdirSync(APP_USER_DATA_DIR, { recursive: true });
    console.log('No local app directory found. Created ' + APP_USER_DATA_DIR);
} else {
    console.log('Local app directory: ' + APP_USER_DATA_DIR);
}

if (!fs.existsSync(LOCAL_OUTPUTS_DIR)) {
    fs.mkdirSync(LOCAL_OUTPUTS_DIR, { recursive: true });
}

const settingsFilePath = path.join(APP_USER_DATA_DIR, SETTINGS_FILE_NAME);

const getDesktopSettings = (): DesktopSettings | undefined => {
    let desktopSettings: DesktopSettings | undefined = undefined;

    try {
        desktopSettings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf-8'));
        console.log('DesktopSettings read from ' + settingsFilePath);
    } catch (e) {
        console.error(e);
    }

    return desktopSettings;
};

const js2EelCompiler = new Js2EelCompiler();

export const apiJsFileList = async (): Promise<string[] | null> => {
    const desktopSettings = getDesktopSettings();

    if (desktopSettings && desktopSettings.inputDir) {
        const jsFileList = getAllJsFilePaths(desktopSettings);

        return jsFileList;
    }

    return null;
};

export const apiLoadSettings = async (): Promise<DesktopSettings | null> => {
    return loadSettingsFile();
};

export const apiSaveSetting = async (
    _event: IpcMainInvokeEvent,
    body: { key: keyof DesktopSettings; value: string }
): Promise<boolean> => {
    const optionKey = body.key;
    const optionValue = body.value;

    return Promise.resolve(saveSetting(optionKey, optionValue));
};

export const apiLoadJsSrc = async (
    _event: IpcMainInvokeEvent,
    fileName: string
): Promise<string | null> => {
    const desktopSettings = getDesktopSettings();

    if (
        !desktopSettings ||
        !desktopSettings.inputDir ||
        !fileName ||
        typeof fileName !== 'string'
    ) {
        return null;
    }

    try {
        const potentialFileContent = fs.readFileSync(
            path.join(desktopSettings.inputDir, fileName),
            'utf-8'
        );

        return potentialFileContent;
    } catch {
        return null;
    }
};

export const apiSaveJsSrc = async (
    _event: IpcMainInvokeEvent,
    fileName: string,
    content: string
): Promise<boolean> => {
    const desktopSettings = getDesktopSettings();

    if (!desktopSettings || !desktopSettings.inputDir || fileName.startsWith('example://')) {
        return false;
    } else {
        fs.writeFileSync(path.join(desktopSettings.inputDir, fileName), content);
        return true;
    }
};

export const apiJsCompile = async (
    _event: IpcMainInvokeEvent,
    filePath: string,
    jsSrc: string
): Promise<CompileResult | { success: false }> => {
    const desktopSettings = getDesktopSettings();

    if (!desktopSettings) {
        console.error('apiJsCompile(): Desktop settings not found');

        return { success: false };
    }

    if (!desktopSettings.outputDir) {
        console.error('Error: output dir in desktop settings not set');
    }
    if (desktopSettings.outputDir && !fs.existsSync(desktopSettings.outputDir)) {
        fs.mkdirSync(desktopSettings.outputDir, { recursive: true });
    }

    const result: CompileResult | null = await compileJs(
        js2EelCompiler,
        jsSrc,
        filePath,
        desktopSettings
    );

    if (result) {
        return result;
    } else {
        console.error('No result received from compiler');

        return { success: false };
    }
};

export const openDirectory = async (
    _event: IpcMainInvokeEvent,
    mainWindow: Electron.BrowserWindow,
    defaultPath: string | null | undefined
): Promise<string | null> => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'showHiddenFiles', 'createDirectory'],
        defaultPath: defaultPath || undefined
    });

    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
};

export const showDirInFileBrowser = async (
    _event: IpcMainInvokeEvent,
    dirPath: string
): Promise<void> => {
    shell.openPath(dirPath);
};
