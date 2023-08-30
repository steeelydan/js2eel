import fs from 'fs';
import path from 'path';

import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export const getAllJsFilePaths = (desktopSettings: DesktopSettings): string[] | null => {
    const inputDirPath = desktopSettings.inputDir;

    if (inputDirPath) {
        let fileNames = fs.readdirSync(inputDirPath);
        fileNames = fileNames.filter((filename) => filename.endsWith('.js'));

        const jsSrcFilesList = fileNames.map((filename) => path.join(inputDirPath, filename));

        return jsSrcFilesList;
    } else {
        return null;
    }
};
