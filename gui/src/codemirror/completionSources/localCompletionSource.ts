import { syntaxTree } from '@codemirror/language';
import { NodeWeakMap, IterMode } from '@lezer/common';

import type {
    CompletionContext,
    CompletionResult,
    Completion,
} from '@codemirror/autocomplete';
import type { SyntaxNode, SyntaxNodeRef } from '@lezer/common';
import type { Text } from '@codemirror/state';

const Identifier = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/;

export const dontComplete = [
    'TemplateString',
    'String',
    'RegExp',
    'LineComment',
    'BlockComment',
    'VariableDefinition',
    'TypeDefinition',
    'Label',
    'PropertyDefinition',
    'PropertyName',
    'PrivatePropertyDefinition',
    'PrivatePropertyName',
    '.',
    '?.'
];

const ScopeNodes = new Set([
    'Script',
    'Block',
    'FunctionExpression',
    'FunctionDeclaration',
    'ArrowFunction',
    'MethodDeclaration',
    'ForStatement'
]);

const functionContext = ['FunctionDeclaration'];

const cache = new NodeWeakMap<readonly Completion[]>();

function defID(type: string) {
    return (node: SyntaxNodeRef, def: (node: SyntaxNodeRef, type: string) => void): boolean => {
        const id = node.node.getChild('VariableDefinition');
        if (id) def(id, type);
        return true;
    };
}

const gatherCompletions: {
    [node: string]: (
        node: SyntaxNodeRef,
        def: (node: SyntaxNodeRef, type: string) => void
    ) => void | boolean;
} = {
    FunctionDeclaration: defID('function'),
    ClassDeclaration: defID('class'),
    ClassExpression: () => true,
    EnumDeclaration: defID('constant'),
    TypeAliasDeclaration: defID('type'),
    NamespaceDeclaration: defID('namespace'),
    VariableDefinition(node, def) {
        if (!node.matchContext(functionContext)) def(node, 'variable');
    },
    TypeDefinition(node, def) {
        def(node, 'type');
    },
    __proto__: null as any
};

const getScope = (doc: Text, node: SyntaxNode): readonly Completion[] => {
    const cached = cache.get(node);
    if (cached) return cached;

    const completions: Completion[] = [];
    let top = true;
    const def = (node: SyntaxNodeRef, type: string): void => {
        const name = doc.sliceString(node.from, node.to);
        completions.push({ label: name, type, boost: 20 /* FIXME */ });
    };
    node.cursor(IterMode.IncludeAnonymous).iterate((node) => {
        if (top) {
            top = false;
        } else if (node.name) {
            const gather = gatherCompletions[node.name];
            if ((gather && gather(node, def)) || ScopeNodes.has(node.name)) return false;
        } else if (node.to - node.from > 8192) {
            // Allow caching for bigger internal nodes
            for (const c of getScope(doc, node.node)) completions.push(c);
            return false;
        }

        return; // FIXME what is correct return value?
    });
    cache.set(node, completions);
    return completions;
};

/// Completion source that looks up locally defined names in
/// JavaScript code.
export function localCompletionSource(context: CompletionContext): CompletionResult | null {
    const inner = syntaxTree(context.state).resolveInner(context.pos, -1);
    if (dontComplete.indexOf(inner.name) > -1) return null;
    const isWord =
        inner.name == 'VariableName' ||
        (inner.to - inner.from < 20 &&
            Identifier.test(context.state.sliceDoc(inner.from, inner.to)));
    if (!isWord && !context.explicit) return null;
    let options: Completion[] = [];
    for (let pos: SyntaxNode | null = inner; pos; pos = pos.parent) {
        if (ScopeNodes.has(pos.name)) options = options.concat(getScope(context.state.doc, pos));
    }
    return {
        options,
        from: isWord ? inner.from : context.pos,
        validFor: Identifier
    };
}
