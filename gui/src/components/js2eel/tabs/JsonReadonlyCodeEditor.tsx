import { useEffect, useRef, useState } from 'preact/hooks';
import { EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { syntaxHighlighting } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { keymap, drawSelection } from '@codemirror/view';

import type { VNode } from 'preact';
import { codemirrorThemeBright } from '../../../codemirror/codeMirrorThemes';
import { useRecallScrollPosition } from '../useRecallScrollPosition';
import { highlightStyleBright } from '../../../codemirror/codeMirrorHighlightStyles';

type Props = {
    scrollId: string;
    content: string;
};

export const JsonReadonlyCodeEditor = ({ scrollId, content }: Props): VNode => {
    const jsonEditorRef = useRef<EditorView | null>(null);
    const jsonEditorElRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [stateScrollId, setStateScrollId] = useState<string>();

    // FIXME change to use PersistedScrollable
    useRecallScrollPosition(scrollContainerRef, stateScrollId);

    useEffect(() => {
        if (!jsonEditorElRef.current) {
            return;
        }

        jsonEditorRef.current = new EditorView({
            doc: content,
            extensions: [
                codemirrorThemeBright,
                json(),
                drawSelection(),
                EditorState.readOnly.of(true),
                syntaxHighlighting(highlightStyleBright),
                keymap.of([...searchKeymap])
            ],
            parent: jsonEditorElRef.current
        });

        scrollContainerRef.current = jsonEditorElRef.current.querySelector('.cm-scroller');

        setStateScrollId(scrollId);

        return (): void => {
            jsonEditorRef.current?.destroy();
        };
    }, [content, scrollId, stateScrollId]);

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }} ref={jsonEditorElRef} />
    );
};
