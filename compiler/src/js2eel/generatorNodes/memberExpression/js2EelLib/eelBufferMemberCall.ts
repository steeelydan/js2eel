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
        case 'setStart': {
            const { args, errors } = evaluateLibraryFunctionCall(
                callExpression,
                [
                    {
                        name: 'position',
                        required: true,
                        allowedValues: defaultNumericArgAllowedValues
                    }
                ],
                instance
            );

            if (errors) {
                instance.multipleErrors(errors);

                return JSFX_DENY_COMPILATION;
            }

            for (let i = 0; i < eelBuffer.dimensions; i++) {
                bufferMemberCallSrc += `${suffixEelBuffer(eelBuffer.name, i.toString())} = ${i} * ${
                    eelBuffer.size
                } + ${args.position.value};\n`;
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
