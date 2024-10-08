import { suffixScopeByScopeSuffix } from '../../suffixersAndPrefixers/suffixScope.js';

import type { Identifier, ObjectExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import type { ObjectRepresentation } from '../../types';

export const objectExpression = (
    // FIXME: Allow literals without identifier
    objectIdentifier: Identifier,
    objectExpression: ObjectExpression,
    instance: Js2EelCompiler
): { objectRepresentation: ObjectRepresentation; eelSrc: string } | null => {
    let eelSrc = '';

    const object: ObjectRepresentation = {};

    for (const property of objectExpression.properties) {
        if (property.type !== 'Property') {
            instance.error(
                'TypeError',
                `Object property type ${property.type} is not allowed`,
                property
            );

            return null;
        }

        if (property.key.type !== 'Identifier') {
            instance.error(
                'TypeError',
                `Object property key type ${property.key.type} not allowed`,
                property.key
            );

            return null;
        }

        switch (property.value.type) {
            case 'Literal': {
                if (
                    typeof property.value.value !== 'number' ||
                    property.value.value === undefined
                ) {
                    instance.error(
                        'TypeError',
                        `Literal object property value must be number. ${typeof property.value
                            .value} not allowed`,
                        property.value
                    );

                    return null;
                }

                object[property.key.name] = property.value.value;
                eelSrc += `${objectIdentifier.name}__${suffixScopeByScopeSuffix(
                    property.key.name,
                    instance.getCurrentScopeSuffix()
                )} = ${property.value.value};\n`;

                break;
            }
            default: {
                instance.error(
                    'TypeError',
                    `Object property value is wrong type. ${property.value.type} not allowed`,
                    property.value
                );

                return null;
            }
        }
    }

    return { objectRepresentation: object, eelSrc: eelSrc };
};
