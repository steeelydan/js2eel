import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('program', () => {
    it('produces error if body node is of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'return', inChannels: 2, outChannels: 2 });

class myClass {}`);

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

    it('produces error if no plugin config found', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`let myVar = 1;
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.23 */

desc:

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myVar = 1;


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('GenericError');
        expect(result.errors[1].type).to.equal('GenericError');
    });

    it('produces error if forbidden function called in root scope', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'alert', inChannels: 2, outChannels: 2 });

alert('Hey')`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.23 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
    });

    it('produces error if forbidden member call object in root scope', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'alert', inChannels: 2, outChannels: 2 });

document.getElementById('Hey');`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.23 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
    });

    it('produces error if forbidden member call member in root scope', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'alert', inChannels: 2, outChannels: 2 });

Math.random()`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.23 */

desc:alert

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('IllegalPropertyError');
    });

    it('Error if expression type not allowed', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'program', inChannels: 2, outChannels: 2 });

[1, 2, 3];`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:program

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Error if call expression callee type not allowed', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'program', inChannels: 2, outChannels: 2 });

new EelBuffer(2, 2)();
`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:program

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Error if member expression callee type not identifier', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'program', inChannels: 2, outChannels: 2 });

"someString".slice(0, 1);`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:program

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
