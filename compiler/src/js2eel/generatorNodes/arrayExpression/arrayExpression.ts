import type { ArrayExpression, Identifier } from 'estree';
import type { Js2EelCompiler } from '../../index.js';
import type { ObjectValue } from '../../types.js';

export const arrayExpression = (
    arrayExpression: ArrayExpression,
    instance: Js2EelCompiler
): (string | Record<string, ObjectValue>)[] => {
    const value: (string | Record<string, ObjectValue>)[] = [];

    for (const element of arrayExpression.elements) {
        switch (element?.type) {
            case 'ObjectExpression': {
                const objValue: Record<string, ObjectValue> = {};
                for (const prop of element.properties) {
                    if (prop.type !== 'Property') {
                        instance.error(
                            'TypeError',
                            `Object property has wrong type: ${prop.type}`,
                            prop
                        );

                        break;
                    }

                    switch (prop.key.type) {
                        case 'Identifier': {
                            break;
                        }

                        default: {
                            instance.error(
                                'TypeError',
                                `Object property key has wrong type: ${prop.key.type}`,
                                prop.key
                            );
                        }
                    }

                    switch (prop.value.type) {
                        case 'Literal': {
                            objValue[(prop.key as Identifier).name] = prop.value.value;

                            break;
                        }

                        default: {
                            instance.error(
                                'TypeError',
                                'Object property value has wrong type',
                                prop.value
                            );
                        }
                    }
                }

                value.push(objValue);

                break;
            }

            default: {
                instance.error('TypeError', 'Array elements must be objects', element);
                break;
            }
        }
    }

    return value;
};
