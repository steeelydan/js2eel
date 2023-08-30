import { describe } from 'mocha';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { expect } from 'chai';
import { testEelSrc } from '../../../test/helpers';

describe('newEelBuffer()', () => {
    it('gives error if no arguments', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer();`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(3);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.errors[1].type).to.equal('ArgumentError');
        expect(result.errors[2].type).to.equal('ArgumentError');
    });

    it('gives error if too few arguments', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(2);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.errors[1].type).to.equal('ArgumentError');
    });

    it('gives error if too many arguments', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(2, 3, 4);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ArgumentError');
    });

    it('gives error if wrong argument type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(2, "hello");`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('gives error if wrong argument value', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(2, -2);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        // TypeError because the value is a different node type: UnaryExpression
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('gives error if dimensions too big', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(65, 2);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        // TypeError because the value is a different node type: UnaryExpression
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('gives error if dimensions 0', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(0, 2);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        // TypeError because the value is a different node type: UnaryExpression
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('gives error if size too big', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(2, 9000000);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        // TypeError because the value is a different node type: UnaryExpression
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('gives error if size 0', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'alert', inChannels: 2, outChannels: 2 });

const arr = new EelBuffer(2, 0);`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        // TypeError because the value is a different node type: UnaryExpression
        expect(result.errors[0].type).to.equal('ValidationError');
    });
});
