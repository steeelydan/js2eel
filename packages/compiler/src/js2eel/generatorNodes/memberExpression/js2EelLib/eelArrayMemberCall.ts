import type { Identifier, PrivateIdentifier } from 'estree';
import type { Js2EelCompiler } from '../../../index.js';
import type { EelArray } from '../../../types.js';

export const eelArrayMemberCall = (
    eelArray: EelArray,
    calleeObject: Identifier,
    calleeProperty: Identifier | PrivateIdentifier,
    instance: Js2EelCompiler
): string => {
    let arrayMemberCallSrc = '';

    switch (calleeProperty.name) {
        case 'size': {
            arrayMemberCallSrc += eelArray.size;
            break;
        }
        case 'dimensions': {
            arrayMemberCallSrc += eelArray.dimensions;
            break;
        }
        default: {
            instance.error(
                'UnknownSymbolError',
                `EelErray member call: Member does not exist: ${calleeProperty.name}`,
                calleeProperty
            );
        }
    }

    return arrayMemberCallSrc;
};
