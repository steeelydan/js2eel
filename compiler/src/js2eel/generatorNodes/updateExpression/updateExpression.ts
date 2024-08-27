import { identifier } from '../identifier/identifier.js';
import { JSFX_DENY_COMPILATION } from '../../constants.js';

import type { UpdateExpression } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';

export const updateExpression = (
    updateExpression: UpdateExpression,
    instance: Js2EelCompiler
): string => {
    let argumentSrc = '';

    switch (updateExpression.argument.type) {
        case 'Identifier': {
            argumentSrc += identifier(updateExpression.argument, instance);

            break;
        }

        default: {
            instance.error(
                'TypeError',
                `Update expression argument type not allowed: ${updateExpression.argument.type}`,
                updateExpression.argument
            );

            return JSFX_DENY_COMPILATION;
        }
    }

    if (updateExpression.operator === '++') {
        return `${argumentSrc} += 1`;
    } else {
        return `${argumentSrc} -= 1`;
    }
};
