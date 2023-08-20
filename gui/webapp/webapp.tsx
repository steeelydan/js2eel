import { render } from 'preact';
import { EditorApp } from '../src/components/EditorApp';
import { Js2EelCompiler } from '@js2eel/compiler';
import { Js2EelBrowserStorage } from '../src/storage/Js2EelBrowserStorage';

import type { WrappedCompileResult } from '../src/types';

import '../src/style.css';

const storage = new Js2EelBrowserStorage();

const js2EelCompiler = new Js2EelCompiler();

const onCompile = async (_filePath: string, jsSrc: string): Promise<WrappedCompileResult> => {
    const now = performance.now();
    js2EelCompiler.reset();
    const result = js2EelCompiler.compile(jsSrc);

    const compileTime = performance.now() - now;

    return {
        result: result,
        compileTime: compileTime
    };
};

render(
    <EditorApp environment="webapp" initialStorage={storage} onCompile={onCompile} />,
    document.getElementById('app') as HTMLElement
);
