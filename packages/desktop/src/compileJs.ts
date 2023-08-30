import path from 'path';
import fs from 'fs';

import { getFileNameFromFilePath, type Js2EelCompiler } from '@js2eel/compiler';
import { LOCAL_OUTPUTS_DIR } from './constants';

import type { CompileResult, DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

export const compileJs = async (
    js2EelCompiler: Js2EelCompiler,
    jsSrcRaw: string,
    absoluteFilePath: string,
    desktopSettings: DesktopSettings
): Promise<CompileResult | null> => {
    const startBench = performance.now();

    const result = js2EelCompiler.compile(jsSrcRaw);

    if (!result) {
        throw new Error('Error compiling. No result.');
    }

    console.log(
        `${new Date().toISOString().slice(0, 19)} File compiled: ${absoluteFilePath}. Duration: ${(
            performance.now() - startBench
        ).toFixed(1)} ms`
    );

    if (result.errors.length) {
        const COMPILER_ERROR_PATH = path.join(
            LOCAL_OUTPUTS_DIR,
            `${result.name}-compiler-errors.json`
        );

        console.log(
            `\n${result.errors.length} Errors found. See fullcompileResult. errors in ${COMPILER_ERROR_PATH}\n`
        );

        result.errors.forEach((error) => {
            console.error(`Line ${error.node?.loc?.start.line}: ${error.type}: ${error.msg}`);
        });

        fs.writeFileSync(COMPILER_ERROR_PATH, JSON.stringify(result.errors, null, 4));
    } else {
        if (!desktopSettings.outputDir) {
            console.warn(
                `Could not write compile result because no output directory was specified`
            );
        } else {
            fs.writeFileSync(
                path.join(
                    desktopSettings.outputDir,
                    `${getFileNameFromFilePath(absoluteFilePath).slice(0, -3)}.jsfx`
                ),
                result.src
            );
        }
    }

    if (result.warnings.length) {
        console.log();

        result.warnings.forEach((warning) => {
            console.warn(warning.msg);
        });
    }

    fs.writeFileSync(
        path.join(
            LOCAL_OUTPUTS_DIR,
            `${getFileNameFromFilePath(absoluteFilePath).slice(0, -3)}-tree.json`
        ),
        JSON.stringify(result.tree, null, 4)
    );

    console.log();

    return result;
};
