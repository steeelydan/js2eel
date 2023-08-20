export const addExamplePrefix = (fileName: string): string => {
    return 'example://' + fileName;
};

export const stripExamplePrefix = (absoluteFilePath: string): string => {
    if (absoluteFilePath.startsWith('example://')) {
        return absoluteFilePath.slice(10);
    }

    return absoluteFilePath;
};
