import fs from 'fs';
import path from 'path';
import { Marked } from 'marked';

import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const DOCS_MD_PATH = path.resolve('../docs');
const OUTPUT_DIR = path.resolve('src/docs');

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

const renderer = new marked.Renderer();

renderer.link = (link) => {
    if (link.href.startsWith('#')) {
        return `<a href="${link.href}">${link.text}</a>`;
    }

    return `<a target="_blank" href="${link.href}">${link.text}</a>`;
};

const files = fs.readdirSync(DOCS_MD_PATH);

const fileMap = {};

files.forEach((fileName) => {
    const docContent = fs.readFileSync(path.join(DOCS_MD_PATH, fileName), 'utf8');

    const parsed = marked.parse(docContent, {
        mangle: false,
        headerIds: false,
        renderer: renderer
    });

    fileMap[fileName.slice(0, -3)] = parsed;
});

fs.writeFileSync(path.join(OUTPUT_DIR, 'rendered-docs.json'), JSON.stringify(fileMap, null, 4));
