import fs from 'fs';
import path from 'path';

const paths = ['dist/esm/js2eel/constants.js', 'dist/cjs/js2eel/constants.js'];

paths.forEach((filePath) => {
    try {
        const constantsPath = path.resolve(filePath);
        const constantsContent = fs.readFileSync(constantsPath, 'utf-8');

        if (!constantsContent) {
            return;
        }

        const packageJsonText = fs.readFileSync(path.resolve('package.json'), 'utf8');
        const packageJson = JSON.parse(packageJsonText);

        const newFileContent = constantsContent.replace(
            'TO_BE_REPLACED_COMPILER_VERSION',
            `${packageJson.version}`
        );

        fs.writeFileSync(constantsPath, newFileContent);

        console.log('constants file saved, content: ' + newFileContent.slice(0, 20));
    } catch (e) {
        console.error(e);
    }
});
