import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../../test/helpers.js';

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
out_pin:Out 0
out_pin:Out 1


@init

myBuf__B0 = 0 * 3 + 0;
myBuf__B1 = 1 * 3 + 0;
myBuf__size = 3;


dim = 2;
`)
        );
    });

    it('Error if call to unknown member', () => {
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
out_pin:Out 0
out_pin:Out 1


@init

myBuf__B0 = 0 * 3 + 0;
myBuf__B1 = 1 * 3 + 0;
myBuf__size = 3;


dim = ;
`)
        );
    });

    it('Error if swap called without arguments', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'swap - no args', inChannels: 2, outChannels: 2 });

const myBuf1 = new EelBuffer(1, 300);

onBlock(() => {
    myBuf1.swap();
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.errors[1].type).to.equal('ArgumentError');
        expect(result.warnings.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED_COMPILER_VERSION */

desc:swap - no args

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myBuf1__B0 = 0 * 300 + 0;
myBuf1__size = 300;


@block

?ä__DENY_COMPILATION;


`)
        );
    });

    it('Error if swap called with argument that is no buffer / no buffer found', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'swap - wrong arg', inChannels: 2, outChannels: 2 });

const myBuf1 = new EelBuffer(1, 300);
const myBuf2 = "Hello";

onBlock(() => {
    myBuf1.swap(myBuf2);
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.warnings.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED_COMPILER_VERSION */

desc:swap - wrong arg

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myBuf2 = Hello;
myBuf1__B0 = 0 * 300 + 0;
myBuf1__size = 300;


@block

?ä__DENY_COMPILATION;


`)
        );
    });

    it('Error if swap with buffer of different dimensions', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'swap - dimensions', inChannels: 2, outChannels: 2 });

const myBuf1 = new EelBuffer(1, 300);
const myBuf2 = new EelBuffer(2, 300);

onBlock(() => {
    myBuf1.swap(myBuf2);
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BoundaryError');
        expect(result.warnings.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED_COMPILER_VERSION */

desc:swap - dimensions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myBuf1__B0 = 0 * 300 + 0;
myBuf1__size = 300;
myBuf2__B0 = 0 * 300 + 300;
myBuf2__B1 = 1 * 300 + 300;
myBuf2__size = 300;


@block

?ä__DENY_COMPILATION;


`)
        );
    });

    it('Error if swap with buffer of different size', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'swap - size', inChannels: 2, outChannels: 2 });

const myBuf1 = new EelBuffer(1, 300);
const myBuf2 = new EelBuffer(1, 500);

onBlock(() => {
    myBuf1.swap(myBuf2);
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BoundaryError');
        expect(result.warnings.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED_COMPILER_VERSION */

desc:swap - size

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myBuf1__B0 = 0 * 300 + 0;
myBuf1__size = 300;
myBuf2__B0 = 0 * 500 + 300;
myBuf2__size = 500;


@block

?ä__DENY_COMPILATION;


`)
        );
    });
});
