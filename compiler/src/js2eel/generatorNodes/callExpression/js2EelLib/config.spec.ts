import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../../test/helpers.js';

describe('config()', () => {
    it('Error if called in non-root scope', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`onSample(() => {
    config({
        description: 'config()',
        inChannels: 2,
        outChannels: 2
    });
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(3);
        expect(result.errors[0].type).to.equal('GenericError');
        expect(result.errors[1].type).to.equal('ScopeError');
        expect(result.errors[2].type).to.equal('GenericError');
    });

    it('Error if called more than once', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'config()', inChannels: 2, outChannels: 2 });
config({ description: 'config()', inChannels: 2, outChannels: 2 });`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:config()

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('StageError');
    });

    it('Error if there are validation errors for the config object', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({ inChannels: 2, outChannels: 2 });`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );

        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ValidationError');
        expect(result.errors[1].type).to.equal('GenericError');
    });
});
