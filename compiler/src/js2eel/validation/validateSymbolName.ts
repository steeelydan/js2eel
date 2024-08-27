import { EEL_MAX_SYMBOL_NAME_LENGTH, EEL_SYMBOL_REGEX } from '../constants.js';

export const validateSymbolName = (symbolName: string): { errors: string[] } => {
    const errors: string[] = [];

    if (symbolName.length > EEL_MAX_SYMBOL_NAME_LENGTH - 64) {
        errors.push(
            `Symbol name cannot be longer than ${
                EEL_MAX_SYMBOL_NAME_LENGTH - 64
            } characters. While EEL symbols can be 127 chars, the compiler might add prefixes or suffixes to the symbol name.`
        );
    }

    if (!EEL_SYMBOL_REGEX.test(symbolName)) {
        errors.push(
            `Symbol name can only start with a letter or underscore. From there on it can only contain letters, numbers and underscores`
        );
    }

    return { errors };
};
