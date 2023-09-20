import { variableDeclaration } from '../variableDeclaration/variableDeclaration.js';
import { functionDeclaration } from '../functionDeclaration/functionDeclaration.js';
import { ifStatement } from '../ifStatement/ifStatement.js';
import { assignmentExpression } from '../assignmentExpression/assignmentExpression.js';
import { callExpression } from '../callExpression/callExpression.js';
import { memberExpression } from '../memberExpression/memberExpression.js';

import { JS2EEL_LIBRARY_FUNCTION_NAMES, JS2EEL_LIBRARY_OBJECT_NAMES } from '../../constants.js';

import type { Program } from 'estree';
import type { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';

export const program = (programNode: Program, instance: Js2EelCompiler): string => {
    let programSrc = '';

    programNode.body.forEach((node) => {
        if (
            !instance.getDescription() &&
            !(
                node.type === 'ExpressionStatement' &&
                node.expression.type === 'CallExpression' &&
                node.expression.callee.type === 'Identifier' &&
                node.expression.callee.name === 'config'
            )
        ) {
            instance.error(
                'GenericError',
                'No plugin configuration found. Call config() at the beginning of the file.',
                node
            );
        }

        switch (node.type) {
            case 'VariableDeclaration': {
                programSrc += variableDeclaration(node, instance);
                break;
            }
            case 'FunctionDeclaration': {
                functionDeclaration(node, instance);
                break;
            }
            case 'IfStatement': {
                programSrc += ifStatement(node, instance);
                break;
            }
            case 'ExpressionStatement': {
                switch (node.expression.type) {
                    case 'CallExpression': {
                        switch (node.expression.callee.type) {
                            case 'Identifier': {
                                if (
                                    !JS2EEL_LIBRARY_FUNCTION_NAMES.has(node.expression.callee.name)
                                ) {
                                    instance.error(
                                        'GenericError',
                                        `Only the following function calls are allowed in root scope: ${Array.from(
                                            JS2EEL_LIBRARY_FUNCTION_NAMES
                                        )
                                            .filter(
                                                (functionName) => functionName !== 'eachChannel'
                                            )
                                            .map((functionName) => functionName + '()')
                                            .join(', ')}`,
                                        node.expression.callee
                                    );

                                    break;
                                }

                                programSrc += callExpression(node.expression, instance);

                                break;
                            }

                            case 'MemberExpression': {
                                switch (node.expression.callee.object.type) {
                                    case 'Identifier': {
                                        if (
                                            !JS2EEL_LIBRARY_OBJECT_NAMES.has(
                                                node.expression.callee.object.name
                                            )
                                        ) {
                                            instance.error(
                                                'GenericError',
                                                `Only the following objects can make member calls in root scope: ${Array.from(
                                                    JS2EEL_LIBRARY_OBJECT_NAMES
                                                )
                                                    .map((functionName) => functionName + '()')
                                                    .join(', ')}`,
                                                node.expression.callee
                                            );

                                            break;
                                        }

                                        programSrc += memberExpression(
                                            node.expression,
                                            node.expression.callee,
                                            instance
                                        );

                                        break;
                                    }

                                    default: {
                                        instance.error(
                                            'TypeError',
                                            `Expression callee object type not allowed: ${node.expression.callee.object.type}`,
                                            node.expression.callee.object
                                        );

                                        break;
                                    }
                                }

                                break;
                            }

                            default: {
                                instance.error(
                                    'TypeError',
                                    `Expression callee type not allowed: ${node.expression.callee.type}`,
                                    node.expression.callee
                                );

                                break;
                            }
                        }

                        break;
                    }

                    case 'AssignmentExpression': {
                        programSrc += assignmentExpression(node.expression, instance);

                        break;
                    }

                    default: {
                        instance.error(
                            'TypeError',
                            `Expression type not allowed: ${node.expression.type}`,
                            node.expression
                        );

                        break;
                    }
                }

                break;
            }

            default: {
                instance.error('TypeError', `Node type not allowed: ${node.type}`, node);
            }
        }
    });

    return programSrc;
};
