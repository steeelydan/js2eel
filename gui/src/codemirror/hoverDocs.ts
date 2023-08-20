import { hoverTooltip } from '@codemirror/view';
import { POPUP_DOCS } from '@js2eel/compiler';
import { getPopupContent } from './getPopupContent.js';

import type { EditorView } from 'codemirror';

export const hoverDocs = hoverTooltip((view, pos, side) => {
    const { from, to, text } = view.state.doc.lineAt(pos);

    let start = pos,
        end = pos;

    while (start > from && /\w/.test(text[start - from - 1])) start--;

    while (end < to && /\w/.test(text[end - from])) end++;

    if ((start == pos && side < 0) || (end == pos && side > 0)) return null;

    const potentialSymbol = text.slice(start - from, end - from);

    let potentialDocs: (typeof POPUP_DOCS)[keyof typeof POPUP_DOCS] | null = null;

    if (potentialSymbol in POPUP_DOCS) {
        potentialDocs = POPUP_DOCS[potentialSymbol as keyof typeof POPUP_DOCS];
    }

    if (potentialDocs) {
        return {
            pos: start,
            end,
            above: true,
            create(_view: EditorView): { dom: HTMLElement } {
                return getPopupContent(potentialDocs!.signature, potentialDocs!.text);
            }
        };
    } else {
        return null;
    }
});
