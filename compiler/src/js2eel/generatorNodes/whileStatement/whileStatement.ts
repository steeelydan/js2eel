import { JSFX_DENY_COMPILATION } from '../../constants.js';
import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { blockStatement } from '../blockStatement/blockStatement.js';
import { indent } from '../../suffixersAndPrefixers/indent.js';
import { removeLastLinebreak } from '../../suffixersAndPrefixers/removeLastLinebreak.js';

import type { WhileStatement } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler';

export const whileStatement = (
    whileStatement: WhileStatement,
    instance: Js2EelCompiler
): string => {
    let testSrc = '';
    let bodySrc = '';

    switch (whileStatement.test.type) {
        case 'BinaryExpression': {
            testSrc += binaryExpression(whileStatement.test, instance);

            break;
        }

        default: {
            instance.error(
                'TypeError',
                `While statement test clause type not allowed: ${whileStatement.test.type}`,
                whileStatement.test
            );

            return JSFX_DENY_COMPILATION;
        }
    }

    switch (whileStatement.body.type) {
        case 'BlockStatement': {
            bodySrc += blockStatement(whileStatement.body, null, instance);
            break;
        }

        default: {
            instance.error(
                'TypeError',
                `While statement body type not allowed: ${whileStatement.body.type}`,
                whileStatement.body
            );

            return JSFX_DENY_COMPILATION;
        }
    }

    const whileStatementSrc = `while (${testSrc}) (
${indent(removeLastLinebreak(bodySrc))}
);
`;

    return whileStatementSrc;
};
