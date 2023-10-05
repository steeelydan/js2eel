import { literal } from '../literal/literal.js';
import { identifier } from '../identifier/identifier.js';
import { memberExpression as compileMemberExpression } from './memberExpression.js';

import { inScope } from '../../environment/inScope.js';
import { suffixEelBuffer } from '../../suffixersAndPrefixers/suffixEelBuffer.js';
import { suffixEelArray } from '../../suffixersAndPrefixers/suffixEelArray.js';
import { prefixParam } from '../../suffixersAndPrefixers/prefixParam.js';
import { suffixScopeByScopeSuffix } from '../../suffixersAndPrefixers/suffixScope.js';
import { callExpression } from '../callExpression/callExpression.js';
import { stripChannelPrefix } from '../../suffixersAndPrefixers/prefixChannel.js';
import { JSFX_DENY_COMPILATION } from '../../constants.js';

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

    let dimensionText = '';
    let positionText = '';

    let isParam = false;
    let declaredSymbol;

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
                    identifier(dimensionPart.object, instance, {
                        isObjectInMemberExpression: true
                    });
                }
            } else {
                instance.error(
                    'TypeError',
                    `Property access can only be performed on an array or buffer.`,
                    object
                );

                return JSFX_DENY_COMPILATION;
            }

            switch (dimensionPart.property.type) {
                case 'Literal': {
                    if (typeof dimensionPart.property.value !== 'number') {
                        instance.error(
                            'TypeError',
                            'Array/Buffer accessor must be number.',
                            dimensionPart.property
                        );

                        return JSFX_DENY_COMPILATION;
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

                        dimensionText = JSFX_DENY_COMPILATION;
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

                            dimensionText = JSFX_DENY_COMPILATION;
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

                    dimensionText = JSFX_DENY_COMPILATION;
                }
            }

            break;
        }
        case 'Identifier': {
            instance.error(
                'GenericError',
                `One-dimensional arrays or buffers are not allowed.`,
                memberExpression
            );

            return JSFX_DENY_COMPILATION;
        }
        default: {
            // Object itself is of wrong type, e.g. "someString"[1]
            instance.error(
                'TypeError',
                `Property access is not allowed on this type: ${object.type}`,
                object
            );

            return JSFX_DENY_COMPILATION;
        }
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

                    positionText = JSFX_DENY_COMPILATION;
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

                    positionText = JSFX_DENY_COMPILATION;
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
            // property node is of wrong type, e.g. myArr[0][-3]
            instance.error(
                'TypeError',
                `Property access is not allowed with this type: ${property.type}`,
                memberExpression.property
            );

            positionText = JSFX_DENY_COMPILATION;
        }
    }

    dimensionText = stripChannelPrefix(dimensionText);
    positionText = stripChannelPrefix(positionText);

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
