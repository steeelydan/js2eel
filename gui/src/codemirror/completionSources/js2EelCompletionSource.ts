import { snippetCompletion as snip } from '@codemirror/autocomplete';
import { getPopupContent } from '../getPopupContent';
import { POPUP_DOCS } from '@js2eel/compiler';

import type {
    CompletionSource,
    CompletionContext,
    CompletionResult,
    Completion,
    CompletionInfo
} from '@codemirror/autocomplete';

const codemirrorDocPopup = (
    symbol: keyof typeof POPUP_DOCS
): ((completion: Completion) => CompletionInfo) => {
    return (_completion: Completion): CompletionInfo => {
        const docs = POPUP_DOCS[symbol];
        if (docs) {
            return getPopupContent(docs.signature, docs.text, docs.example);
        } else {
            return null;
        }
    };
};

const generateSnippets = (type: 'function' | 'class' | 'constant'): Completion[] => {
    const snippets: Completion[] = [];

    for (const [key, value] of Object.entries(POPUP_DOCS)) {
        if (value?.type == type) {
            let boost = 0;

            if (
                value.name === 'config' ||
                value.name === 'EelBuffer' ||
                value.name === 'selectBox' ||
                value.name === 'slider' ||
                value.name === 'console' ||
                value.name.startsWith('on') ||
                value.name === 'eachChannel'
            ) {
                boost += 10;
            }

            if (value.type === 'class') {
                boost += 5;
            }

            if (value.type === 'function') {
                boost += 5;
            }

            if (value.name.startsWith('spl')) {
                boost -= 10;
                boost -= parseFloat(value.name.slice(3)) / 100;
            }

            snippets.push(
                snip(value.autoCompleteTemplate, {
                    label: value.signature,
                    info: codemirrorDocPopup(key),
                    type: type,
                    boost: boost
                })
            );
        }
    }

    return snippets;
};

const classSnippets: readonly Completion[] = [
    // snip('function ${name}(${params}) {\n\t${}\n}', {
    //     label: 'function',
    //     detail: 'definition',
    //     type: 'keyword'
    // }),
    // snip('for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}', {
    //     label: 'for',
    //     detail: 'loop',
    //     type: 'keyword'
    // }),
    // snip('for (let ${name} of ${collection}) {\n\t${}\n}', {
    //     label: 'for',
    //     detail: 'of loop',
    //     type: 'keyword'
    // }),
    // snip('do {\n\t${}\n} while (${})', {
    //     label: 'do',
    //     detail: 'loop',
    //     type: 'keyword'
    // }),
    // snip('while (${}) {\n\t${}\n}', {
    //     label: 'while',
    //     detail: 'loop',
    //     type: 'keyword'
    // }),
    // snip('try {\n\t${}\n} catch (${error}) {\n\t${}\n}', {
    //     label: 'try',
    //     detail: '/ catch block',
    //     type: 'keyword'
    // }),
    // snip('if (${}) {\n\t${}\n}', {
    //     label: 'if',
    //     detail: 'block',
    //     type: 'keyword'
    // }),
    // snip('if (${}) {\n\t${}\n} else {\n\t${}\n}', {
    //     label: 'if',
    //     detail: '/ else block',
    //     type: 'keyword'
    // }),
    // snip('class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}', {
    //     label: 'class',
    //     detail: 'definition',
    //     type: 'keyword'
    // }),
    // snip('import {${names}} from "${module}"\n${}', {
    //     label: 'import',
    //     detail: 'named',
    //     type: 'keyword'
    // }),
    // snip('import ${name} from "${module}"\n${}', {
    //     label: 'import',
    //     detail: 'default',
    //     type: 'keyword'
    // }),
    // snip('EelBuffer(${ch}, ${samples})', {
    //     label: 'EelBuffer(ch, samples)',
    //     boost: 2,
    //     info: codemirrorDocPopup('EelBuffer'),
    //     type: 'class'
    // }),
    // snip('EelArray(${length})', {
    //     label: 'EelArray(length)',
    //     info: "A fixed-size container for numeric data. Is inlined in the EEL source, so don't make it too big.",
    //     type: 'class'
    // })
    ...generateSnippets('class')
];

const functionSnippets: readonly Completion[] = [...generateSnippets('function')];
const constantSnippets: readonly Completion[] = [...generateSnippets('constant')];

const defaultCompletions: readonly Completion[] = [...functionSnippets, ...constantSnippets];

export const js2EelCompletionSource: CompletionSource = (
    context: CompletionContext
): CompletionResult | null => {
    const wordMatch = context.matchBefore(/\w*/);
    const newMatch = context.matchBefore(/new .*/);

    if (newMatch) {
        return {
            from: newMatch.from + 4,
            options: classSnippets
        };
    } else if (wordMatch) {
        if (wordMatch?.from == wordMatch?.to && !context.explicit) return null;

        return {
            from: wordMatch?.from || 0,
            options: [...defaultCompletions]
        };
    } else {
        return null;
    }
};
