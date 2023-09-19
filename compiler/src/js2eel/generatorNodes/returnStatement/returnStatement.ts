import { literal } from '../literal/literal.js';
import { identifier } from '../identifier/identifier.js';
import { binaryExpression } from '../binaryExpression/binaryExpression.js';
import { memberExpression } from '../memberExpression/memberExpression.js';

import type { Js2EelCompiler } from '../../index.js';
import type { ReturnStatement } from 'estree';

export const returnStatement = (
    returnStatement: ReturnStatement,
    parentScopePath: string,
    instance: Js2EelCompiler
): void => {
    let returnStatementSrc = '';

    if (!returnStatement.argument) {
        instance.error('GenericError', 'Cannot return without argument', returnStatement);

        return; // FIXME return without arg
    }

    switch (returnStatement.argument.type) {
        case 'Identifier': {
            returnStatementSrc += identifier(returnStatement.argument, instance);

            break;
        }
        case 'BinaryExpression': {
            returnStatementSrc += binaryExpression(returnStatement.argument, instance);

            break;
        }
        case 'Literal': {
            returnStatementSrc += literal(returnStatement.argument, instance);
            break;
        }
        case 'MemberExpression': {
            returnStatementSrc += memberExpression(
                returnStatement,
                returnStatement.argument,
                instance
            );
            break;
        }
        default: {
            instance.error(
                'TypeError',
                `Return argument type ${returnStatement.argument.type} not allowed`,
                returnStatement
            );
        }
    }

    instance.setReturn(parentScopePath, returnStatementSrc);
};
