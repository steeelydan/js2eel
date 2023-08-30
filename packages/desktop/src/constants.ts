import { app } from 'electron';
import path from 'path';

export const SETTINGS_FILE_NAME = 'settings.json';
export const APP_DATA_DIR = app.getPath('appData');
export const APP_USER_DATA_DIR = app.getPath('userData');
export const LOCAL_OUTPUTS_DIR = path.join(APP_USER_DATA_DIR, 'outputs');
export const REAPER_DEFAULT_EFFECTS_DIR = path.join(APP_DATA_DIR, 'REAPER', 'Effects');
