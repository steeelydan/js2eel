import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../../test/helpers.js';

describe('fileSelector()', () => {
    it('Error if called in non-root scope', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'fileSelector', inChannels: 2, outChannels: 2 });

let ampModelsSelector;

onSample(() => {
    fileSelector(
        1,
        ampModelsSelector,
        'amp_models',
        'none',
        'Impulse Response'
    );
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:fileSelector

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Error if slider number already used', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'sd_amp_sim', inChannels: 2, outChannels: 2 });

let ampModelsSelector;
let ampModelsSelector2;

fileSelector(1, ampModelsSelector, 'amp_models', 'none', 'Impulse Response');
fileSelector(1, ampModelsSelector2, 'amp_models', 'none', 'Impulse Response');
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:sd_amp_sim

slider1:/amp_models:none:Impulse Response

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('EelConventionError');
    });

    it('Error if file selector variable already used', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'sd_amp_sim', inChannels: 2, outChannels: 2 });

let ampModelsSelector;

fileSelector(1, ampModelsSelector, 'amp_models', 'none', 'Impulse Response');
fileSelector(2, ampModelsSelector, 'amp_models', 'none', 'Impulse Response');
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:sd_amp_sim

slider1:/amp_models:none:Impulse Response

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BindingError');
    });

    it('Error if argument invalid', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'sd_amp_sim', inChannels: 2, outChannels: 2 });

let amp;

fileSelector(1, amp, 1337, 'none', 'Impulse Response');
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:sd_amp_sim

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
