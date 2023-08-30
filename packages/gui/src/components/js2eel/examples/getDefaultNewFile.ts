export const getDefaultNewFile = (description: string): string => {
    return `config({description: "${description}", inChannels: 2, outChannels: 2});

onSample(() => {

});`;
};
