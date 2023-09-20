import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_SATURATION_SRC = fs.readFileSync(path.resolve('../examples/06_saturation.js'), 'utf-8');

const EEL_SATURATION_SRC_EXPECTED = `/* Compiled with JS2EEL v0.0.15 */

desc:saturation

slider1:gainInDb=0 < 0, 36, 0.01 >Gain In (dB)
slider2:volumeDb=0 < -18, 18, 0.01 >Volume (dB)

slider3:algorithm=0 < 0, 3, 1 {Sigmoid, Hyperbolic Tangent, Hard Clip} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@slider

gainIn = 10 ^ (gainInDb / (20));
volume = 10 ^ (volumeDb / (20));


@sample


/* Channel 0 */

algorithm == 0 ? (
spl0 = (2 * 1 / ((1 + exp(-gainIn * spl0))) - 1);
) : algorithm == 1 ? (
spl0 = (exp(2 * spl0 * gainIn) - 1) / ((exp(2 * spl0 * gainIn) + 1)) / ((exp(2 * gainIn) - 1) / ((exp(2 * gainIn) + 1)));
) : algorithm == 2 ? (
spl0 *= gainIn;
spl0 = abs(spl0) > 0.5 ? 0.5 * sign(spl0) : spl0;
);
spl0 *= volume;

/* Channel 1 */

algorithm == 0 ? (
spl1 = (2 * 1 / ((1 + exp(-gainIn * spl1))) - 1);
) : algorithm == 1 ? (
spl1 = (exp(2 * spl1 * gainIn) - 1) / ((exp(2 * spl1 * gainIn) + 1)) / ((exp(2 * gainIn) - 1) / ((exp(2 * gainIn) + 1)));
) : algorithm == 2 ? (
spl1 *= gainIn;
spl1 = abs(spl1) > 0.5 ? 0.5 * sign(spl1) : spl1;
);
spl1 *= volume;



`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: Saturation', () => {
    it('Compiles saturation plugin with select box', () => {
        const result = js2EelCompiler.compile(JS_SATURATION_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_SATURATION_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
