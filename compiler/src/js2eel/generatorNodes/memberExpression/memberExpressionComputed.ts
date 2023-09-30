import { literal } from '../literal/literal.js';
import { identifier } from '../identifier/identifier.js';
import { memberExpression as compileMemberExpression } from './memberExpression.js';

import { inScope } from '../../environment/inScope.js';
import { suffixEelBuffer } from '../../suffixersAndPrefixers/suffixEelBuffer.js';
import { suffixEelArray } from '../../suffixersAndPrefixers/suffixEelArray.js';
import { prefixParam } from '../../suffixersAndPrefixers/prefixParam.js';
import { suffixScopeByScopeSuffix } from '../../suffixersAndPrefixers/suffixScope.js';
import { jsfxDenyCompilation } from '../../utils/jsfxNonCompilable.js';

import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import type { MemberExpression } from 'estree';
import type { EelArray, EelBuffer } from '../../types.js';

export const memberExpressionComputed = (
    memberExpression: MemberExpression,
    instance: Js2EelCompiler
): string | null => {
    let computedMemberExpressionSrc = '';

    const object = memberExpression.object;
    const property = memberExpression.property;

    let potentialBuffer: EelBuffer | undefined;
    let potentialArray: EelArray | undefined;

    let dimensionText = jsfxDenyCompilation();
    let positionText = '';

    let isParam = false;
    let declaredSymbol;

    // FIXME: Make sure that arrays & buffers are always accessed in 2 dimensions

    switch (object.type) {
        case 'MemberExpression': {
            // Object is itself member expression, will recurse into 2 dimensions. Example: -> myArr[1] <- [2]
            const dimensionPart = object;

            if (dimensionPart.object.type === 'Identifier') {
                declaredSymbol = instance.getDeclaredSymbolUpInScope(dimensionPart.object.name);
                if (declaredSymbol?.symbol.declarationType === 'param') {
                    isParam = true;

                    // Will mark the symbol as used and give error if doesn't exist. We don't use the return string
                    identifier(dimensionPart.object, instance);
                } else {
                    const potentialArrayOrBufferName = dimensionPart.object.name;

                    potentialBuffer = instance.getEelBuffer(potentialArrayOrBufferName);
                    potentialArray = instance.getEelArray(potentialArrayOrBufferName);

                    // Will mark the symbol as used and give error if doesn't exist. We don't use the return string
                    identifier(dimensionPart.object, instance);
                }
            } else {
                instance.error(
                    'TypeError',
                    `Property access can only be performed on an array or buffer.`,
                    object
                );

                return jsfxDenyCompilation();
            }

            switch (dimensionPart.property.type) {
                case 'Literal': {
                    if (typeof dimensionPart.property.value !== 'number') {
                        instance.error(
                            'TypeError',
                            'Array/Buffer accessor must be number.',
                            dimensionPart.property
                        );

                        break;
                    }

                    let dimensions: number | undefined;

                    if (potentialBuffer) {
                        dimensions = potentialBuffer.dimensions;
                    } else if (potentialArray) {
                        dimensions = potentialArray.dimensions;
                    }

                    if (
                        dimensions !== undefined &&
                        dimensionPart.property.value !== undefined &&
                        dimensionPart.property.value < dimensions
                    ) {
                        dimensionText = literal(dimensionPart.property, instance);
                    } else {
                        instance.error(
                            'BoundaryError',
                            `Array/buffer dimension out of bounds. Array/buffer dimensions are ${dimensions} and you tried to access ${dimensionPart.property.value}`,
                            dimensionPart.property
                        );
                    }

                    break;
                }
                case 'Identifier': {
                    if (isParam) {
                        dimensionText = identifier(dimensionPart.property, instance);
                    } else {
                        if (potentialBuffer) {
                            dimensionText = identifier(dimensionPart.property, instance);
                        } else {
                            instance.error(
                                'ScopeError',
                                `Other than by literal values, arrays can only be accessed by the "channel" param in eachChannel()`,
                                dimensionPart.property
                            );

                            break;
                        }
                    }

                    break;
                }
                default: {
                    instance.error(
                        'TypeError',
                        `Property access is not allowed with this type: ${property.type}`,
                        property
                    );

                    return jsfxDenyCompilation();
                }
            }

            break;
        }
        case 'Identifier': {
            // Object is identifier, so we're 1-dimensional. Example: -> myArr <- [1]
            const potentialArrayOrBufferName = object.name;

            potentialBuffer = instance.getEelBuffer(potentialArrayOrBufferName);
            potentialArray = instance.getEelArray(potentialArrayOrBufferName);

            declaredSymbol = instance.getDeclaredSymbolUpInScope(object.name);

            // Will mark the symbol as used and give error if doesn't exist. We don't use the return string
            identifier(object, instance);

            break;
        }
        default: {
            // Object itself is of wrong type, e.g. "someString"[1]
            instance.error(
                'TypeError',
                `Property access is not allowed on this type: ${object.type}`,
                object
            );
        }
    }

    if (!potentialBuffer && !potentialArray && declaredSymbol?.symbol.declarationType !== 'param') {
        instance.error(
            'TypeError',
            `Property access can only be performed on an array or buffer.`,
            memberExpression
        );

        return jsfxDenyCompilation();
    }

    // Position part
    switch (property.type) {
        case 'Literal': {
            // property is literal, e.g. myArr[-> 1 <-]
            if (typeof property.value !== 'number') {
                instance.error('TypeError', 'Array/buffer accessor must be number.', property);

                break;
            }

            let positions: number | undefined;

            if (potentialArray) {
                positions = potentialArray.size;
            }

            if (positions !== undefined) {
                // Boundary check: Array only, as buffer can be accessed with vars not known at compile time
                if (property.value !== undefined && property.value < positions) {
                    positionText += literal(property, instance);
                } else {
                    instance.error(
                        'BoundaryError',
                        `Array dimension out of bounds. Array size is ${positions} and you tried to access ${property.value}`,
                        property
                    );
                }
            } else {
                positionText += literal(property, instance);
            }

            break;
        }
        case 'Identifier': {
            // property is identifier, e.g. myArr[-> channel <-]
            if (potentialBuffer) {
                positionText += identifier(property, instance);
            } else {
                // Array
                if (
                    inScope('onSample', instance) &&
                    property.name === instance.getEachChannelParams().channelIdentifier
                ) {
                    positionText += identifier(property, instance);
                } else {
                    instance.error(
                        'ScopeError',
                        `Other than by literal values, arrays can only be accessed by the "channel" param in eachChannel()`,
                        property
                    );

                    break;
                }
            }

            break;
        }
        case 'MemberExpression': {
            // property is member expression -> we're 2-dimensional, e.g. myArr[1] -> [2] <-  (??)
            positionText += compileMemberExpression(memberExpression, property, instance);

            break;
        }
        default: {
            // property node is of wrong type, e.g. myArr[-3]
            instance.error(
                'TypeError',
                `Property access is not allowed with this type: ${property.type}`,
                memberExpression
            );

            return jsfxDenyCompilation();
        }
    }

    if (isParam && declaredSymbol) {
        // we suffix the param name to catch it in the callExpression() replacements...
        computedMemberExpressionSrc += prefixParam(
            `${suffixScopeByScopeSuffix(
                declaredSymbol.symbol.name,
                instance.getCurrentScopeSuffix()
            )}__D${dimensionText}__${positionText}`
        );
    } else {
        if (potentialBuffer) {
            computedMemberExpressionSrc += suffixEelBuffer(
                potentialBuffer.name,
                dimensionText,
                positionText
            );
        } else if (potentialArray) {
            computedMemberExpressionSrc += suffixEelArray(
                potentialArray.name,
                dimensionText,
                positionText
            );
        }
    }

    return computedMemberExpressionSrc;
};
