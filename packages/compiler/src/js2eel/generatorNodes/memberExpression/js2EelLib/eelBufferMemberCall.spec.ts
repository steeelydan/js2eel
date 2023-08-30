import { describe, it } from 'mocha';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { expect } from 'chai';
import { testEelSrc } from '../../../test/helpers';

describe('eelBufferMemberCall()', () => {
    it(".dimensions() returns the buffer's dimensions", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eelBufferMemberCall', inChannels: 2, outChannels: 2 });

const myBuf = new EelBuffer(2, 3);

const dim = myBuf.dimensions();`);

        expect(result.success).to.equal(true);
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(1);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eelBufferMemberCall

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myBuf__B0 = 0 * 3;
myBuf__B1 = 1 * 3;
myBuf__size = 3;


dim = 2;
`)
        );
    });

    it("Error if call to unknown member", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eelBufferMemberCall', inChannels: 2, outChannels: 2 });

const myBuf = new EelBuffer(2, 3);

const dim = myBuf.dim();`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
        expect(result.warnings.length).to.equal(1);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eelBufferMemberCall

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myBuf__B0 = 0 * 3;
myBuf__B1 = 1 * 3;
myBuf__size = 3;


dim = ;
`)
        );
    });
});
