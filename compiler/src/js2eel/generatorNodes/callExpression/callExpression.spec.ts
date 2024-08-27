import { expect } from 'chai';
import { Js2EelCompiler } from '../../index.js';
import { testEelSrc } from '../../test/helpers.js';

describe('callExpression()', () => {
    it('Error if wrong argument(s)', () => {
        const JS_SRC = `config({description: "teststuff", inChannels: 2, outChannels: 2});

function myFunc(a, b) {
  return a + b;
}

const myVar = myFunc(3);`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.1.0 */

desc:teststuff

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


myVar = ;
`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ArgumentError');
    });

    it('Error function is not a declared symbol', () => {
        const JS_SRC = `config({ description: 'callExpression', inChannels: 2, outChannels: 2 });

onInit(() => {
    myFunc();
});
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.24 */

desc:callExpression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
    });
});
