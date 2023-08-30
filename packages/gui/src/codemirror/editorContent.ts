import type { EditorView } from 'codemirror';

export const setEditorContent = (editorView: EditorView, src: string): void => {
    editorView.dispatch({
        changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: src
        }
    });
};

export const getEditorContent = (editorView: EditorView): string => {
    return editorView.state.doc.toString();
};
