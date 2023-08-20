import fs from 'fs';
import path from 'path';

import { saveSettingsFile } from './utils/fileUtils';
import {
    APP_USER_DATA_DIR,
    LOCAL_OUTPUTS_DIR,
    REAPER_DEFAULT_EFFECTS_DIR,
    SETTINGS_FILE_NAME
} from './constants';

import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export const startup = async (): Promise<{ settings: DesktopSettings }> => {
    console.log();

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

    let settings: DesktopSettings | undefined = undefined;

    try {
        settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf-8'));
        console.log('DesktopSettings read from ' + settingsFilePath);
    } catch (e) {
        // FIXME
    }

    if (!settings) {
        const newSettings: DesktopSettings = {
            appDir: APP_USER_DATA_DIR,
            reaperDefaultEffectsDir: REAPER_DEFAULT_EFFECTS_DIR,
            inputDir: null,
            outputDir: null
        };

        settings = newSettings;

        saveSettingsFile(settings);
    }

    if (!settings.appDir) {
        settings.appDir = APP_USER_DATA_DIR;

        saveSettingsFile(settings);
    }

    return { settings: settings };
};
