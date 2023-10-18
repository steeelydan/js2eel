export const removeLastLinebreak = (src: string): string => {
    if (src.endsWith('\n')) {
        return src.slice(0, -1);
    }

    return src;
};
