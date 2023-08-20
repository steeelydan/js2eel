export const suffixEelArray = (
    eelArrayName: string,
    dimension: string,
    position: string
): string => {
    return `${eelArrayName}__D${dimension}__${position}`;
};
