import * as eslint from 'eslint-linter-browserify';
import { esLint } from '@codemirror/lang-javascript';
import type { LintSource, Diagnostic } from '@codemirror/lint';

export const createEsLintLintSource = (
    setEslintErrors: (errors: Diagnostic[]) => void
): LintSource => {
    const eslintConfig = {
        parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        env: {
            browser: true,
            node: false
        },
        rules: {
            semi: "error"
        }
    };

    const eslintLintSource = new eslint.Linter();

    return (view): Diagnostic[] => {
        const diagnostics = esLint(eslintLintSource, eslintConfig)(view);
        setEslintErrors(diagnostics);
        return diagnostics;
    };
};
