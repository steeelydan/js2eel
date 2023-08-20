export const suffixInlineReturn = (symbolName: string, inlineReturnSuffix: number): string => {
    return `${symbolName}__${inlineReturnSuffix}`;
};
