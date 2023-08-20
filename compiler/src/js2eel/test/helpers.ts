export const testEelSrc = (text: string): string => {
    const lineBreak = text.indexOf('\n');

    const cut = text.slice(lineBreak + 1);

    return cut;
};
