import { expect } from 'chai';
import { Js2EelCompiler } from '../../index.js';
import { testEelSrc } from '../../test/helpers.js';

describe('blockStatement()', () => {
    it('Generates error if wrong node type in block statement', () => {
        const JS_SRC = `config({description: "teststuff", inChannels: 2, outChannels: 2});

onInit(() => {
  () => null;
});`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.1 */

desc:teststuff

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
});
