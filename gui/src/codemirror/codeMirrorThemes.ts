import { EditorView } from 'codemirror';
import { COLORS } from '../constants';

const svg = (content: string, attrs = `viewBox="0 0 40 40"`): string => {
    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${encodeURIComponent(
        content
    )}</svg>')`;
};
const underline = (color: string): string => {
    return svg(
        `<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${color}" fill="none" stroke-width="1.5"/>`,
        `width="6" height="3"`
    );
};

export const codemirrorThemeBright = EditorView.theme({
    '&': {
        height: '100%',
        fontSize: '9.5pt'
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
        background: '#afd5fe !important'
    },
    '.cm-gutters': {
        borderRight: 'none',
        marginRight: '2px'
    },
    '.cm-scroller': {
        scrollBehavior: 'smooth'
    },
    '.cm-search': {
        fontSize: '12pt'
    },
    '.cm-button': {
        fontSize: '10pt',
        background: COLORS.buttonBg,
        cursor: 'pointer',
        border: 'none'
    },
    '.cm-button:hover': {
        background: COLORS.buttonBgHover
    },
    '.cm-content': {
        fontFamily: 'Hack'
    },
    '.cm-textfield': {
        fontSize: '10pt'
    },
    '.cm-lintRange-error': { backgroundImage: underline(COLORS.error) },
    '.cm-lintRange-warning': { backgroundImage: underline(COLORS.warning) },
    '.cm-tooltip-section pre': {
        fontSize: '9pt'
    }
});
