export const OPTION_LOCAL_STORAGE_PREFIX = 'js2eel_opt_';
export const JS_LOCAL_STORAGE_PREFIX = 'js2eel_js_';

export function getFromLocalStorage(key: string): string | null {
    let result = null;

    try {
        result = localStorage.getItem(key);
        return result;
    } catch (e) {
        return null;
    }
}

export function setInLocalStorage(key: string, value: string): boolean {
    try {
        localStorage.setItem(key, value);

        return true;
    } catch (e) {
        return false;
    }
}
