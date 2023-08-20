export const getLastFilePathSeparator = (path: string): number | null => {
    let separatorIndex = path.lastIndexOf('/');

    if (separatorIndex < 0) {
        separatorIndex = path.lastIndexOf('\\');
    }

    return separatorIndex > -1 ? separatorIndex : null;
};

export const getLastScopePathSeparator = (scopePath: string): number => {
    return scopePath.lastIndexOf('/');
};

export const getFileNameFromFilePath = (absoluteFilePath: string): string => {
    const lastSeparator = getLastFilePathSeparator(absoluteFilePath);

    return lastSeparator !== null ? absoluteFilePath.slice(lastSeparator + 1) : absoluteFilePath;
};
