import { suffixBufferSize } from '../../../suffixersAndPrefixers/suffixBufferSize.js';
import { suffixEelBuffer } from '../../../suffixersAndPrefixers/suffixEelBuffer.js';
import { evaluateLibraryFunctionCall } from '../../callExpression/utils/evaluateLibraryFunctionCall.js';
import { defaultNumericArgAllowedValues } from '../../helpers.js';
import { JSFX_DENY_COMPILATION } from '../../../constants.js';

import type { CallExpression, Identifier, PrivateIdentifier } from 'estree';
import type { Js2EelCompiler } from '../../../index.js';
import type { EelBuffer } from '../../../types.js';

export const eelBufferMemberCall = (
    eelBuffer: EelBuffer,
    calleeObject: Identifier,
    calleeProperty: Identifier | PrivateIdentifier,
    callExpression: CallExpression,
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
        case 'start': {
            bufferMemberCallSrc += suffixEelBuffer(eelBuffer.name, '0');
            break;
        }
        case 'swap': {
            const { args, errors } = evaluateLibraryFunctionCall(
                callExpression,
                [
                    {
                        name: 'otherBuffer',
                        required: true,
                        allowedValues: [{ nodeType: 'Identifier' }]
                    }
                ],
                instance
            );

            if (errors) {
                instance.multipleErrors(errors);

                return JSFX_DENY_COMPILATION;
            }

            const otherBuffer = instance.getEelBuffer(args.otherBuffer.name);

            if (!otherBuffer) {
                instance.error(
                    'TypeError',
                    `Given argument ${args.otherBuffer.name} is not of type EelBuffer`,
                    args.otherBuffer.node
                );

                return JSFX_DENY_COMPILATION;
            }

            if (otherBuffer.dimensions !== eelBuffer.dimensions) {
                instance.error(
                    'BoundaryError',
                    `Other buffer ${args.otherBuffer.name} has different dimensions: ${otherBuffer.dimensions}`,
                    args.otherBuffer.node
                );

                return JSFX_DENY_COMPILATION;
            }

            if (otherBuffer.size !== eelBuffer.size) {
                instance.error(
                    'BoundaryError',
                    `Other buffer ${args.otherBuffer.name} has different size: ${otherBuffer.size}`,
                    args.otherBuffer.node
                );

                return JSFX_DENY_COMPILATION;
            }

            for (let i = 0; i < eelBuffer.dimensions; i++) {
                const printedOrigBuffer = suffixEelBuffer(eelBuffer.name, i.toString());
                const printedOtherBuffer = suffixEelBuffer(otherBuffer.name, i.toString());

                bufferMemberCallSrc += `__TEMP_BUFFER_SWAP__${i} = ${printedOrigBuffer};
${printedOrigBuffer} = ${printedOtherBuffer};
${printedOtherBuffer} = __TEMP_BUFFER_SWAP__${i};
`;
            }

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
