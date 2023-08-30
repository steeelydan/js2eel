import { format } from 'prettier';
// @ts-ignore
import * as parserBabel from 'prettier/plugins/babel.mjs';
// @ts-ignore
import * as pluginEstree from 'prettier/plugins/estree.mjs';

import type { EditorView } from 'codemirror';
import type { MutableRef } from 'preact/hooks';

export const formatCode = async (editorView: EditorView): Promise<void> => {
    const formattedCode = await format(editorView.state.doc.toString(), {
        printWidth: 80,
        tabWidth: 4,
        singleQuote: true,
        semi: true,
        trailingComma: 'none',
        parser: 'babel',
        plugins: [parserBabel, pluginEstree]
    });

    editorView.dispatch({
        changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: formattedCode
        }
    });
};
