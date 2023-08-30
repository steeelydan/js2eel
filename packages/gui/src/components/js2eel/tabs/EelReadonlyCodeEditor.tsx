import { useEffect, useRef, useState } from 'preact/hooks';
import { EditorView } from 'codemirror';
import { lineNumbers, drawSelection, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { useJs2EelStore } from '../../../zustand/js2eelStore';

import type { VNode } from 'preact';
import { codemirrorThemeBright } from '../../../codemirror/codeMirrorThemes';
import { useRecallScrollPosition } from '../useRecallScrollPosition';
import { COLORS } from '../../../constants';

export const EelReadonlyCodeEditor = (): VNode => {
    const eelEditorRef = useJs2EelStore((state) => state.eelEditorRef);
    const compileResult = useJs2EelStore((state) => state.compileResult);
    const eelReadonlyElRef = useRef<HTMLDivElement>(null);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [scrollId, setScrollId] = useState<string>();

    // FIXME change to use PersistedScrollable
    useRecallScrollPosition(scrollContainerRef, scrollId);

    useEffect(() => {
        if (!eelReadonlyElRef.current || !compileResult) {
            return;
        }

        eelEditorRef.current = new EditorView({
            doc: compileResult.src,
            extensions: [
                codemirrorThemeBright,
                lineNumbers(),
                drawSelection(),
                highlightSelectionMatches(),
                EditorView.lineWrapping,
                EditorState.readOnly.of(true),
                keymap.of([...searchKeymap])
            ],
            parent: eelReadonlyElRef.current
        });

        scrollContainerRef.current = eelReadonlyElRef.current.querySelector('.cm-scroller');
        setScrollId('eelReadonlyCodeEditor');

        return () => {
            eelEditorRef.current?.destroy();
        };
    }, [eelEditorRef, compileResult]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                color:
                    compileResult?.errors.length || !compileResult?.success
                        ? COLORS.error
                        : 'inherit'
            }}
            ref={eelReadonlyElRef}
        />
    );
};
