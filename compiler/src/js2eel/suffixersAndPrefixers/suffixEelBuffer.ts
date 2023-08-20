export const suffixEelBuffer = (
    bufferName: string,
    dimensionText: string,
    positionText?: string
): string => {
    return `${bufferName}__B${dimensionText}${positionText ? '[' + positionText + ']' : ''}`;
};
