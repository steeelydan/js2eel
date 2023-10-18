export const indent = (src: string): string => {
    return src
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n');
};
