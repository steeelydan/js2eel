import { expect } from 'chai';
import { Js2EelCompiler } from '../../index.js';
import { testEelSrc } from '../../test/helpers.js';

describe('blockStatement()', () => {
    it('Generates error if wrong node type in block statement', () => {
        const JS_SRC = `config({ description: 'blockStatement', inChannels: 2, outChannels: 2 });

onSample(() => {
    {
        hey: 1;
    }
});
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.1 */

desc:blockStatement

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Error if empty statement / lone semicolon', () => {
        const JS_SRC = `config({description: "blockStatement", inChannels: 2, outChannels: 2});

onSample(() => {
    ;
});`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.24 */

desc:blockStatement

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('User function in block works', () => {
        const JS_SRC = `config({ description: 'blockStatement', inChannels: 2, outChannels: 2 });

onSample(() => {
    function someFunc(someParam) {
        const someBodyNumber = 2;

        return someParam * someBodyNumber;
    }

    const myVar = someFunc(5);
});
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.7.0 */

desc:blockStatement

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

someBodyNumber__S3 = 2;
R__S3__0 = 5 * someBodyNumber__S3;
myVar__S2 = R__S3__0;


`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(0);
    });
});
