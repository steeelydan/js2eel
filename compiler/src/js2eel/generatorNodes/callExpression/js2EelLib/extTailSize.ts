import Joi from 'joi';

import { evaluateLibraryFunctionCall } from '../utils/evaluateLibraryFunctionCall.js';
import { JSFX_DENY_COMPILATION } from '../../../constants.js';

import type { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import type { CallExpression } from 'estree';

export const extTailSize = (callExpression: CallExpression, instance: Js2EelCompiler): string => {
    let extTailSizeSrc = '';
    const scopePath = instance.getCurrentScopePath();
    const scopedEnvironment = instance.getScopeEntry(scopePath);

    if (
        !scopedEnvironment ||
        (scopedEnvironment.scopeId !== 'onInit' && scopedEnvironment.scopeId !== 'onSlider')
    ) {
        instance.error(
            'ScopeError',
            'extTailSize() can only be called in onInit() and onSlider()',
            callExpression
        );

        return JSFX_DENY_COMPILATION;
    }

    const { args, errors } = evaluateLibraryFunctionCall(
        callExpression,
        [
            {
                name: 'value',
                required: true,
                allowedValues: [
                    {
                        nodeType: 'Literal',
                        validationSchema: Joi.number()
                    }
                ]
            }
        ],
        instance
    );

    if (errors) {
        instance.multipleErrors(errors);

        return JSFX_DENY_COMPILATION;
    }

    extTailSizeSrc += `ext_tail_size = ${args.value.value};\n`;

    return extTailSizeSrc;
};
