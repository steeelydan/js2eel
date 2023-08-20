import { EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import {
    keymap,
    lineNumbers,
    drawSelection,
    dropCursor
} from '@codemirror/view';
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
    syntaxHighlighting,
    indentUnit,
    bracketMatching
} from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { linter } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { createEsLintLintSource } from './esLintLintSource';
import { createJs2EelLintSource } from './js2EelLintSource';

import { codemirrorThemeBright } from './codeMirrorThemes';

import type { MutableRef } from 'preact/hooks';
import type { ViewUpdate } from '@codemirror/view';
import type { Diagnostic } from '@codemirror/lint';
import type { CompileResult } from '@js2eel/compiler/dist/types/js2eel/types';
import { js2EelCompletion } from './js2eelCompletion';
import { hoverDocs } from './hoverDocs';
import { highlightStyleBright } from './codeMirrorHighlightStyles';

export const jsCodeMirror = (
    currentSrcRef: MutableRef<string>,
    compileResultRef: MutableRef<CompileResult | null>,
    jsEditorElRef: MutableRef<HTMLDivElement | null>,
    onEditorUpdate: (update: ViewUpdate) => void,
    setEslintErrors: (eslintErrors: Diagnostic[]) => void
): EditorView | null => {
    if (jsEditorElRef.current) {
        return new EditorView({
            doc: currentSrcRef.current,
            extensions: [
                codemirrorThemeBright,
                javascript(),
                history(),
                lineNumbers(),
                linter(createEsLintLintSource(setEslintErrors)),
                linter(createJs2EelLintSource(compileResultRef)),
                EditorView.lineWrapping,
                closeBrackets(),
                js2EelCompletion(),
                hoverDocs,
                highlightSelectionMatches(),
                keymap.of([
                    ...defaultKeymap,
                    ...historyKeymap,
                    indentWithTab,
                    ...searchKeymap,
                    ...closeBracketsKeymap,
                    ...completionKeymap
                ]),
                syntaxHighlighting(highlightStyleBright),
                EditorView.updateListener.of((update) => {
                    onEditorUpdate(update);
                }),
                // highlightSpecialChars(),
                drawSelection(),
                dropCursor(),
                indentUnit.of('    '),
                bracketMatching()
                // EditorState.allowMultipleSelections.of(true),
                // indentOnInput(),
            ],
            parent: jsEditorElRef.current
        });
    }

    return null;
};
