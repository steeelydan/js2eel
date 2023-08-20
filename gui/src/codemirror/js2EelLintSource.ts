import type { MutableRef } from 'preact/hooks';
import type { LintSource, Diagnostic } from '@codemirror/lint';
import type { CompileResult } from '@js2eel/compiler/dist/types/js2eel/types';

export const createJs2EelLintSource = (
    compileResultRef: MutableRef<CompileResult | null>
): LintSource => {
    return (): Diagnostic[] => {
        const diagnostics: Diagnostic[] = [];
        const errors = compileResultRef.current?.errors;
        const warnings = compileResultRef.current?.warnings;

        const errorStarts: number[] = [];
        const errorEnds: number[] = [];

        if (errors) {
            let currentStart = 0;
            let currentEnd = 0;

            errors.forEach((error) => {
                if (error.node && 'start' in error.node && 'end' in error.node) {
                    currentStart = error.node.start as number;
                    currentEnd = error.node.end as number;

                    errorStarts.push(currentStart);
                    errorEnds.push(currentEnd);

                    diagnostics.push({
                        from: currentStart,
                        to: currentEnd,
                        message: error.type + ': ' + error.msg,
                        severity: 'error'
                    });
                }
            });
        }

        if (warnings) {
            let currentStart = 0;
            let currentEnd = 0;

            warnings.forEach((warning) => {
                if (warning.node && 'start' in warning.node && 'end' in warning.node) {
                    currentStart = warning.node.start as number;
                    currentEnd = warning.node.end as number;

                    let errorStartPos: number | undefined = undefined;

                    for (let i = 0; i < errorStarts.length; i++) {
                        const pos = errorStarts[i];
                        if (pos >= currentStart && pos <= currentEnd) {
                            errorStartPos = pos;

                            break;
                        }
                    }

                    // Not overlapping with error
                    if (errorStartPos === undefined) {
                        diagnostics.push({
                            from: currentStart,
                            to: currentEnd,
                            message: warning.msg,
                            severity: 'warning'
                        });
                    }
                }
            });
        }

        return diagnostics;
    };
};
