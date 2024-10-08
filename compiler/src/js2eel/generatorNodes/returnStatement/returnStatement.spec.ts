import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../test/helpers.js';

describe('returnStatement', () => {
    it('produces error if return is without argument', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'return', inChannels: 2, outChannels: 2 });

function myFunc() {
    return;
}
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.23 */

desc:return

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
    });

    it('Error if argument node type is not allowed', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'return', inChannels: 2, outChannels: 2 });

function myFunc() {
    return {};
}
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.23 */

desc:return

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
