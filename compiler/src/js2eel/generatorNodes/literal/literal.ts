import type { Literal } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';

export const literal = (literal: Literal, instance: Js2EelCompiler): string => {
    switch (typeof literal.value) {
        case 'number': {
            return literal.value.toString();
        }
        case 'string': {
            return literal.value;
        }
        case 'boolean': {
            return literal.value ? '1' : '0';
        }
        default: {
            instance.error(
                'TypeError',
                `Literal: Value type ${typeof literal.value} not allowed.`,
                literal
            );
            return '';
        }
    }
};
