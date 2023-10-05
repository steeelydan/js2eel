import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('conditionalExpression()', () => {
    it('Test part is wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 ? spl1 : spl2;
});`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 =  ? spl1 : spl2;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Consequent part is wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 === 1 ? spl4 = 2 : spl2;
});`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 = spl0 == 1 ?  : spl2;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Alternate part is wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 === 1 ? spl1 : spl2 = 3;
});`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 = spl0 == 1 ? spl1 : ;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Consequent is literal', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 === 1 ? 3 : spl2;
});`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 = spl0 == 1 ? 3 : spl2;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Consequent is unary', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 === 1 ? -3 : spl2;
});`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 = spl0 == 1 ? -3 : spl2;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Alternate is literal', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 === 1 ? 3 : 4;
});`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 = spl0 == 1 ? 3 : 4;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Alternate is unary', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 === 1 ? 3 : -4;
});`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 = spl0 == 1 ? 3 : -4;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Alternate is binary', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });


onSample(() => {
    spl3 = spl0 === 1 ? 3 : -4 * 2;
});`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

spl3 = spl0 == 1 ? 3 : -4 * 2;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Consequent is member expression', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: "conditional", inChannels: 2, outChannels: 2 });

const myEelbuf = new EelBuffer(2, 2);

onSample(() => {
    spl3 = spl0 === 1 ? myEelbuf[0][1] : -4 * 2;
});`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myEelbuf__B0 = 0 * 2;
myEelbuf__B1 = 1 * 2;
myEelbuf__size = 2;


@sample

spl3 = spl0 == 1 ? myEelbuf__B0[1] : -4 * 2;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Alternate is member expression', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'conditional', inChannels: 2, outChannels: 2 });

const myEelbuf = new EelBuffer(2, 2);

onSample(() => {
    spl3 = spl0 === 1 ? 3 : myEelbuf[1][1];
});
`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:conditional

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myEelbuf__B0 = 0 * 2;
myEelbuf__B1 = 1 * 2;
myEelbuf__size = 2;


@sample

spl3 = spl0 == 1 ? 3 : myEelbuf__B1[1];


`)
        );
        expect(result.errors.length).to.equal(0);
    });
});
