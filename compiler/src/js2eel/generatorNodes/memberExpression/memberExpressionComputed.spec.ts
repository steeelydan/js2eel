import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('memberExpressionComputed', () => {
    it('1-dimensional: error if property access on wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myVar = 'somestring';

onSample(() => {
    const myVar2 = myVar[3];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = somestring;


@sample

myVar2__S2 = ?ä__DENY_COMPILATION;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('1-dimensional: error if object itself is of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

onSample(() => {
    const myVar = "someString"[2];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = ?ä__DENY_COMPILATION;


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[1].type).to.equal('TypeError');
    });

    it('2-dimensional: error if object itself is of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

onSample(() => {
    const myVar2 = "somestring"[3][1];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar2__S2 = ?ä__DENY_COMPILATION;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('1-dimensional: gives type error if property access is with wrong node type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 3);

onSample(() => {
    const myVar = myArr[-3];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = ?ä__DENY_COMPILATION;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('2-dimensional: gives type error if property access is with wrong node type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 3);

onSample(() => {
    const myVar = myArr[-1][2];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = ?ä__DENY_COMPILATION;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('1-dimensional: gives error if accessed with wrong type, e.g. string', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 3);

onSample(() => {
    const myVar = myArr["a string"];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = myArr__D?ä__DENY_COMPILATION__;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('2-dimensional: gives error if property value is wrong type, e.g. string', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 3);

onSample(() => {
    const myVar = myArr[1]["a string"];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = myArr__D1__;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('2-dimensional: gives error if object access property value is wrong type, e.g. string', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 3);

onSample(() => {
    const myVar = myArr["astring"][1];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = myArr__D?ä__DENY_COMPILATION__1;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('gives error if accessed with wrong identifier: 1st dimension', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 3);

const myVar = spl0;

onSample(() => {
    const myVar2 = myArr[myVar][0];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = spl0;


@sample

myVar2__S2 = myArr__D?ä__DENY_COMPILATION__0;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('gives error if accessed with wrong identifier: 2nd dimension', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 3);

const myVar = spl0;

onSample(() => {
    const myVar2 = myArr[0][myVar];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = spl0;


@sample

myVar2__S2 = myArr__D0__;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('buffer access with pure literals', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const buf = new EelBuffer(2, 2);

onSample(() => {
    const myVar2 = buf[1][1];
});
`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

buf__B0 = 0 * 2;
buf__B1 = 1 * 2;
buf__size = 2;


@sample

myVar2__S2 = buf__B1[1];


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Error if out of bounds: 1st dimension', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const buf = new EelBuffer(2, 2);

onSample(() => {
    const myVar2 = buf[3][1];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

buf__B0 = 0 * 2;
buf__B1 = 1 * 2;
buf__size = 2;


@sample

myVar2__S2 = buf__B?ä__DENY_COMPILATION[1];


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BoundaryError');
    });

    it('Error if out of bounds: 2nd dimension (array only)', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'member_expression_computed', inChannels: 2, outChannels: 2 });

const arr = new EelArray(2, 2);

onSample(() => {
    const myVar2 = arr[1][4];
});
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:member_expression_computed

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar2__S2 = arr__D1__;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BoundaryError');
    });
});
