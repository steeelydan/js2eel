import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const dtsPath = path.resolve('./js2eel.d.ts');
const docsPath = path.resolve('./src/popupDocs.ts');

const dtsFile = fs.readFileSync(dtsPath, 'utf8');

let src = dtsFile;
let srcSplit = src.split('\n');
let srcSplitNew = [];
srcSplit.map((line) => {
    if (!line.startsWith('//')) {
        srcSplitNew.push(line);
    }
});
src = srcSplitNew.join('\n');

let parts = [];

const formatJsDoc = (jsDoc) => {
    jsDoc = jsDoc.trim().replace('/**', '').replace('*/', '').trim();
    let split = jsDoc.split('\n');

    split = split.map((line) => {
        return line.replace(/( )?\*( )?/, '').trim();
    });

    jsDoc = split.join('\n');

    return jsDoc;
};

const typeMap = {
    function: 183,
    number: 150,
    string: 154,
    array: 187,
    object: 205,
    constructor: 175
};

const tsOutput = [];

while (src.length > 0) {
    const jsDocStart = src.indexOf('/**');
    if (jsDocStart === -1) {
        // parts.push(src);
        src = '';
        break;
    } else {
        const jsDocEnd = src.indexOf('*/', jsDocStart);
        let jsDoc = src.slice(jsDocStart, jsDocEnd + 2);
        const nextJsDocStart = src.indexOf('/**', jsDocEnd);
        let fullSignature = '';
        if (nextJsDocStart > -1) {
            fullSignature = src.slice(jsDocEnd + 2, nextJsDocStart);
        } else {
            fullSignature = src.slice(jsDocEnd + 2);
        }
        jsDoc = formatJsDoc(jsDoc);
        fullSignature = fullSignature.trim().replace('declare ', '');
        let name = '';
        let type = '';
        let autoCompleteTemplate = '';

        if (fullSignature.startsWith('function')) {
            type = 'function';

            const node = ts.createSourceFile('x.ts', fullSignature, ts.ScriptTarget.Latest);

            name = node.statements[0].name.escapedText;
            const tsParams = node.statements[0].parameters;

            tsOutput.push(tsParams);

            let stringParams = [];

            tsParams.forEach((param) => {
                // console.log("param", param.name.escapedText, param.type);
                if (param.name.kind === typeMap['object']) {
                    stringParams.push('{${}}');
                } else if (param.type.kind === typeMap["array"]) {
                    stringParams.push('[${}]');
                } else if (param.type.kind === typeMap['string']) {
                    stringParams.push('${' + param.name.escapedText + '}');
                } else if (param.type.kind === typeMap['number']) {
                    stringParams.push('${' + param.name.escapedText + '}');
                } else if (param.type.kind === typeMap['function']) {
                    const functionParams = param.type.parameters;

                    stringParams.push(`(${functionParams
                        .map((param) => param.name.escapedText)
                        .join(', ')}) => {
    ${'${}'}
}`);
                }
            });
            fullSignature = fullSignature.trim().replace('function ', '');
            autoCompleteTemplate = `${name}(${stringParams.join(', ')});`;
        } else if (fullSignature.startsWith('class')) {
            type = 'class';

            const node = ts.createSourceFile('x.ts', fullSignature, ts.ScriptTarget.Latest);

            const classDefinition = node.statements[0];

            name = classDefinition.name.escapedText;

            const constructor = classDefinition.members.find((member) => {
                return member.kind === typeMap['constructor'];
            });

            const tsParams = constructor.parameters;

            let stringParams = [];

            tsParams.forEach((param) => {
                if (param.name.kind === typeMap['object']) {
                    stringParams.push('{${}}');
                } else if (param.type.kind === typeMap['string']) {
                    stringParams.push('${' + param.name.escapedText + '}');
                } else if (param.type.kind === typeMap['number']) {
                    stringParams.push('${' + param.name.escapedText + '}');
                } else if (param.type.kind === typeMap['function']) {
                    const functionParams = param.type.parameters;

                    stringParams.push(`(${functionParams
                        .map((param) => param.name.escapedText)
                        .join(', ')}) => {
    ${'${}'}
}`);
                }
            });
            autoCompleteTemplate = `${name}(${stringParams.join(', ')});`;
            fullSignature = fullSignature.trim().replace('class ', '');

            tsOutput.push(node.statements[0]);
        } else if (fullSignature.startsWith('const')) {
            name = fullSignature.slice(6, fullSignature.indexOf(':')).trim();
            type = 'constant';
            fullSignature = fullSignature.trim().replace('const ', '');
            autoCompleteTemplate = name;
        }
        parts.push({
            name: name,
            type: type,
            text: jsDoc,
            signature: fullSignature,
            autoCompleteTemplate: autoCompleteTemplate
        });
        src = src.slice(jsDocEnd);
    }
}

let renderedParts = '';

parts.forEach((part, index) => {
    renderedParts += `${part.name}: ${JSON.stringify(part, null, 4)}${
        index < parts.length - 1 ? ',\n' : ''
    }`;
});

const docsFile = `// This is autogenerated. Do not edit.

export const POPUP_DOCS: {
    [symbolName in string]?: {
        name: string;
        type: 'function' | 'class' | 'constant';
        text: string;
        signature: string;
        autoCompleteTemplate: string;
    };
} = {
    ${renderedParts}
};
`;

fs.writeFileSync(docsPath, docsFile);
fs.writeFileSync('debug_tsoutput.json', JSON.stringify(tsOutput, null, 4));
