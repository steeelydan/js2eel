import path from 'path';
import fs from 'fs';

import { APP_USER_DATA_DIR, REAPER_DEFAULT_EFFECTS_DIR, SETTINGS_FILE_NAME } from '../constants';

import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export const saveSettingsFile = (newSettings: DesktopSettings): boolean => {
    try {
        const settingsFilePath = path.join(APP_USER_DATA_DIR, SETTINGS_FILE_NAME);

        fs.writeFileSync(settingsFilePath, JSON.stringify(newSettings, null, 4));

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const loadSettingsFile = (): DesktopSettings | null => {
    const settingsFilePath = path.join(APP_USER_DATA_DIR, SETTINGS_FILE_NAME);
    const settingsExist = fs.existsSync(settingsFilePath);

    let settings: DesktopSettings | null = null;

    if (!settingsExist) {
        settings = {
            appDir: APP_USER_DATA_DIR,
            reaperDefaultEffectsDir: REAPER_DEFAULT_EFFECTS_DIR,
            inputDir: null,
            outputDir: null
        };

        saveSettingsFile(settings);
    } else {
        settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf-8'));
    }

    return settings;
};

export const saveSetting = (key: keyof DesktopSettings, value: string): boolean => {
    let oldSettings = loadSettingsFile();

    if (!oldSettings) {
        oldSettings = {
            appDir: APP_USER_DATA_DIR,
            reaperDefaultEffectsDir: REAPER_DEFAULT_EFFECTS_DIR,
            inputDir: null,
            outputDir: null
        };
    }

    const newSettings: DesktopSettings = { ...oldSettings };

    newSettings[key] = value;

    return saveSettingsFile(newSettings);
};
