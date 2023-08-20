import fs from 'fs';
import chokidar from 'chokidar';

import { compileJs } from './compileJs';

import type { Js2EelCompiler } from '@js2eel/compiler';
import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export const registerFileWatcher = (
    desktopSettings: DesktopSettings,
    jsSrcFiles: string[],
    js2EelCompiler: Js2EelCompiler
): void => {
    console.log('Watching for changes:', desktopSettings.inputDir + '\\*.js\n');

    chokidar
        .watch(jsSrcFiles, { awaitWriteFinish: { stabilityThreshold: 50 }, persistent: true })
        .on('change', async (absoluteFilePath) => {
            try {
                const jsSrcRaw = fs.readFileSync(absoluteFilePath, 'utf-8');
                await compileJs(js2EelCompiler, jsSrcRaw, absoluteFilePath, desktopSettings);
            } catch (e) {
                console.error(e);
            }
        });
};
