import { expect } from 'chai';
import { Js2EelCompiler } from '../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../test/helpers.js';

describe('registerDeclarationParam()', () => {
    it('Error if reserved lib symbol', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'saturation', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel((spl0, channel) => {});
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:saturation

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample




`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('SymbolAlreadyDeclaredError');
    });

    it('Error if symbol name already declared', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'saturation', inChannels: 2, outChannels: 2 });

let myVar = 3;

onSample(() => {
    eachChannel((MYVAR, channel) => {});
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:saturation

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myVar = 3;


@sample




`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('SymbolAlreadyDeclaredError');
    });
});
