export const prefixChannel = (channel: number): string => {
    return 'CH__' + channel;
};

export const stripChannelPrefix = (channelSymbol: string): string => {
    if (channelSymbol.startsWith('CH__')) {
        return channelSymbol.slice(4);
    }

    return channelSymbol;
};
