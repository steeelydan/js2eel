export const addSemicolonIfNone = (src: string, newline = true): string => {
    const trimmed = src.trim();

    if (trimmed.length && !trimmed.endsWith(';')) {
        return `${src};${newline ? '\n' : ''}`;
    } else {
        return src;
    }
};
