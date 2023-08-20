import { getSymbolInNextUpScope } from '../../environment/getSymbolInNextUpScope.js';
import { suffixScopeBySymbol } from '../../suffixersAndPrefixers/suffixScope.js';
import { EEL_LIBRARY_VARS } from '../../constants.js';

import type { Identifier } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { inScope } from '../../environment/inScope.js';

export const identifier = (identifier: Identifier, instance: Js2EelCompiler): string => {
    if (EEL_LIBRARY_VARS.has(identifier.name.toLowerCase())) {
        // We can lowercase here because there's only lowercase symbols in EEL
        return identifier.name;
    }

    let identifierSrc = '';

    const declaredSymbol = getSymbolInNextUpScope(identifier.name, instance);

    const sampleParamsMap = instance.getEachChannelParams();
    const inSampleParamsMap = Object.values(sampleParamsMap).includes(identifier.name);

    if (!declaredSymbol && !inSampleParamsMap) {
        instance.error(
            'UnknownSymbolError',
            'Variable not declared: ' + identifier.name,
            identifier
        );

        return '';
    }

    if (inScope('onSample', instance) && inSampleParamsMap) {
        // eachChannel params

        const currentChannel = instance.getCurrentChannel();

        if (sampleParamsMap.channelIdentifier === identifier.name) {
            identifierSrc = currentChannel.toString();
        } else {
            identifierSrc = `spl${currentChannel}`;
        }
    } else {
        if (declaredSymbol && declaredSymbol.symbol.inScopePath !== 'root') {
            identifierSrc = suffixScopeBySymbol(identifier.name, declaredSymbol.symbol);
        } else {
            identifierSrc = identifier.name;
        }
    }

    instance.setSymbolUsed(identifier.name);

    return identifierSrc;
};
