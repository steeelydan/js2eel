import { prefixDebugMessage } from '../../../suffixersAndPrefixers/prefixDebugMessage.js';
import { evaluateLibraryFunctionCall } from '../../callExpression/utils/evaluateLibraryFunctionCall.js';
import { suffixScopeBySymbol } from '../../../suffixersAndPrefixers/suffixScope.js';

import type { Js2EelCompiler } from '../../../index.js';
import type { CallExpression, Identifier, PrivateIdentifier } from 'estree';
import { addSemicolonIfNone } from '../../../suffixersAndPrefixers/addSemicolonIfNone.js';

export const consoleMemberCall = (
    parentCallExpression: CallExpression,
    calleeProperty: Identifier | PrivateIdentifier,
    instance: Js2EelCompiler
): string => {
    let consoleMemberCallSrc = '';

    switch (calleeProperty.name) {
        case 'log': {
            const { args, errors } = evaluateLibraryFunctionCall(
                parentCallExpression,
                [
                    {
                        name: 'someVar',
                        required: true,
                        allowedValues: [
                            {
                                nodeType: 'Identifier'
                            }
                        ]
                    }
                ],
                instance
            );
            if (errors) {
                instance.multipleErrors(errors);
                break;
            }

            const declaredSymbolEntry = instance.getDeclaredSymbolUpInScope(args.someVar.name);

            if (!declaredSymbolEntry) {
                instance.error(
                    'UnknownSymbolError',
                    `Unknown symbol ${args.someVar.name}`,
                    parentCallExpression
                );

                break;
            }

            consoleMemberCallSrc += `${prefixDebugMessage(
                suffixScopeBySymbol(args.someVar.name, declaredSymbolEntry.symbol)
            )} = ${suffixScopeBySymbol(args.someVar.name, declaredSymbolEntry.symbol)}`;

            break;
        }

        default: {
            instance.error(
                'IllegalPropertyError',
                `Error in console member call: Property ${calleeProperty.name} not allowed or arg type wrong`,
                calleeProperty
            );
        }
    }

    return addSemicolonIfNone(consoleMemberCallSrc);
};
