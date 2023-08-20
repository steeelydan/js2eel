import {
    OPTION_LOCAL_STORAGE_PREFIX,
    getFromLocalStorage,
    setInLocalStorage
} from './localStorage';

import type { ClientSettings } from '../types';

export const loadClientSetting = (key: keyof ClientSettings): Promise<string | null> => {
    return Promise.resolve(getFromLocalStorage(OPTION_LOCAL_STORAGE_PREFIX + key));
};

export const saveClientSetting = (key: keyof ClientSettings, value: string): Promise<boolean> => {
    return Promise.resolve(setInLocalStorage(OPTION_LOCAL_STORAGE_PREFIX + key, value));
};

