import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('identifier()', () => {
    it('error if using EelArray or EelBuffer without accessors', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'mono_delay', inChannels: 2, outChannels: 2 });

const myEelArray = new EelArray(2, 2);
const myVar = myEelArray;`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:mono_delay

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = ?ä__DENY_COMPILATION;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
    });

});
