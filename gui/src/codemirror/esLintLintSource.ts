import * as eslint from 'eslint-linter-browserify';
import { esLint } from '@codemirror/lang-javascript';
import type { LintSource, Diagnostic } from '@codemirror/lint';

export const createEsLintLintSource = (
    setEslintErrors: (errors: Diagnostic[]) => void
): LintSource => {
    const eslintConfig = {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module'
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
