import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../../test/helpers.js';

describe('mathMemberCall()', () => {
    it('pow(): Validation errors', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({description: "blockStatement", inChannels: 2, outChannels: 2});

Math.pow("string", 2);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:blockStatement

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });
});
