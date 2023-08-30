import { describe, it } from 'mocha';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { expect } from 'chai';
import { testEelSrc } from '../../../test/helpers';

describe('slider()', () => {
    it('Error if called in non-root scope', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'slider', inChannels: 2, outChannels: 2 });

let volume;

onInit(() => {
    slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:slider

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Error if slider number already used', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'slider', inChannels: 2, outChannels: 2 });

let volume;
let volume2;

slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');
slider(1, volume2, 0, -150, 18, 0.1, 'Volume [dB]');
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:slider

slider1:volume=0 < -150, 18, 0.1 >Volume [dB]

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('EelConventionError');
    });

    it('Error if slider number invalid', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'slider', inChannels: 2, outChannels: 2 });

let volume;

slider(65, volume, 0, -150, 18, 0.1, 'Volume [dB]');
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:slider

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('Error if variable already bound to another slider or select box', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'slider', inChannels: 2, outChannels: 2 });

let volume;

slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');
slider(2, volume, 0, -150, 18, 0.1, 'Volume [dB]');
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:slider

slider1:volume=0 < -150, 18, 0.1 >Volume [dB]

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BindingError');
    });

    it('Error if bound variable is const', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'slider', inChannels: 2, outChannels: 2 });

const volume = 0;

slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:slider

slider1:volume=0 < -150, 18, 0.1 >Volume [dB]

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
    });

    it('Validation errors', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'slider', inChannels: 2, outChannels: 2 });

let volume;

slider(1, volume, 0, -150, 18, 0.1, 300);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:slider

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });
});
