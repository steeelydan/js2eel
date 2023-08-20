import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const foreground = '#9cdcfe',
    invalid = '#ff0000',
    keyword = '#0000FF',
    controlAndModule = '#0000FF',
    functions = '#795E26',
    typesAndClasses = '#4ec9b0',
    tagNames = '#569cd6',
    operators = '#000000',
    regexes = '#811F3F',
    strings = '#A31515',
    names = '#000000',
    punctuationAndSeparators = '#000000',
    angleBrackets = '#000000',
    templateStringBraces = '#569cd6',
    propertyNames = '#0451A5',
    booleansAndAtoms = '#000000',
    numbersAndUnits = '#098658',
    metaAndComments = '#008000';


export const highlightStyleBright = HighlightStyle.define([
    { tag: tags.keyword, color: keyword },
    {
        tag: [tags.controlKeyword, tags.moduleKeyword],
        color: controlAndModule
    },
    {
        tag: [tags.name, tags.deleted, tags.character, tags.macroName],
        color: names
    },
    {
        tag: [tags.propertyName],
        color: propertyNames
    },

    { tag: [tags.variableName, tags.labelName], color: names },
    {
        tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
        color: booleansAndAtoms
    },
    { tag: [tags.definition(tags.name)], color: foreground },
    {
        tag: [
            tags.typeName,
            tags.className,
            tags.number,
            tags.changed,
            tags.annotation,
            tags.modifier,
            tags.self,
            tags.namespace
        ],
        color: typesAndClasses
    },
    { tag: [tags.tagName], color: tagNames },
    {
        tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
        color: functions
    },
    { tag: [tags.number], color: numbersAndUnits },
    {
        tag: [
            tags.operator,
            tags.operatorKeyword,
            tags.url,
            tags.escape,
            tags.regexp,
            tags.link,
            tags.special(tags.string)
        ],
        color: operators
    },
    {
        tag: [tags.regexp],
        color: regexes
    },
    {
        tag: [tags.special(tags.string)],
        color: strings
    },
    { tag: [tags.meta, tags.comment], color: metaAndComments },
    { tag: [tags.punctuation, tags.separator], color: punctuationAndSeparators },
    { tag: [tags.angleBracket], color: angleBrackets },
    { tag: tags.special(tags.brace), color: templateStringBraces },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
    { tag: tags.link, color: metaAndComments, textDecoration: 'underline' },
    { tag: tags.heading, fontWeight: 'bold', color: names },
    {
        tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
        color: booleansAndAtoms
    },
    {
        tag: [tags.processingInstruction, tags.string, tags.inserted],
        color: strings
    },
    { tag: tags.invalid, color: invalid }
]);
