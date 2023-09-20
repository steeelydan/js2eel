import { suffixBufferSize } from '../../../suffixersAndPrefixers/suffixBufferSize.js';

import type { Identifier, PrivateIdentifier } from 'estree';
import type { Js2EelCompiler } from '../../../index.js';
import type { EelBuffer } from '../../../types.js';

export const eelBufferMemberCall = (
    eelBuffer: EelBuffer,
    calleeObject: Identifier,
    calleeProperty: Identifier | PrivateIdentifier,
    instance: Js2EelCompiler
): string => {
    let bufferMemberCallSrc = '';

    switch (calleeProperty.name) {
        case 'size': {
            bufferMemberCallSrc += `${suffixBufferSize(calleeObject.name)}`;
            break;
        }
        case 'dimensions': {
            bufferMemberCallSrc += eelBuffer.dimensions;
            break;
        }
        default: {
            instance.error(
                'UnknownSymbolError',
                `EelBuffer member call: Member does not exist: ${calleeProperty.name}`,
                calleeProperty
            );
        }
    }

    return bufferMemberCallSrc;
};
