import { JSFX_DENY_COMPILATION } from '../../constants';
import { binaryExpression } from '../binaryExpression/binaryExpression';
import { blockStatement } from '../blockStatement/blockStatement';

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
                `While statement body type not allowed: ${whileStatement.test.type}`,
                whileStatement.test
            );

            return JSFX_DENY_COMPILATION;
        }
    }

    const whileStatementSrc = `while (${testSrc}) (
    ${bodySrc});
`;

    return whileStatementSrc;
};
