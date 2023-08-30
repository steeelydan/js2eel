import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import {
    apiJsCompile,
    apiJsFileList,
    apiLoadJsSrc,
    apiLoadSettings,
    apiSaveJsSrc,
    apiSaveSetting,
    openDirectory,
    showDirInFileBrowser
} from './ipcFunctions';
import { startup } from './startup';
import { getAllJsFilePaths } from './dataAccess/dataAccess';
import { Js2EelCompiler } from '@js2eel/compiler';
import { registerFileWatcher } from './registerFileWatcher';

(async (): Promise<void> => {
    const { settings } = await startup();

    const jsSrcFilesList = getAllJsFilePaths(settings);

    if (jsSrcFilesList) {
        const js2EelCompiler = new Js2EelCompiler();

        registerFileWatcher(settings, jsSrcFilesList, js2EelCompiler);
    } else {
        console.warn('Input directory not set. Could not register file watcher.');
    }

    let browserWindow: BrowserWindow;

    const createWindow = (): void => {
        browserWindow = new BrowserWindow({
            icon: path.join(__dirname, '/../distResources/icon.png'),
            show: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                spellcheck: false
            },
            autoHideMenuBar: true
        });

        browserWindow.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });
        browserWindow.maximize();
        browserWindow.loadFile('./gui-dist/index.html');
        browserWindow.show();
    };

    app.whenReady().then(() => {
        ipcMain.handle('apiJsFileList', apiJsFileList);
        ipcMain.handle('apiLoadSettings', apiLoadSettings);
        ipcMain.handle('apiSaveSetting', apiSaveSetting);
        ipcMain.handle('apiLoadJsSrc', apiLoadJsSrc);
        ipcMain.handle('apiSaveJsSrc', apiSaveJsSrc);
        ipcMain.handle('apiJsCompile', apiJsCompile);
        ipcMain.handle('showDirInFileBrowser', showDirInFileBrowser);
        ipcMain.handle('dialog:openDirectory', (event) => openDirectory(event, browserWindow));

        createWindow();
    });
})();
