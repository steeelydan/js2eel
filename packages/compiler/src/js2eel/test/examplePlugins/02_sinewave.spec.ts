import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_SINEWAVE_SRC = fs.readFileSync(path.resolve('../examples/02_sinewave.js'), 'utf-8');

const EEL_SINEWAVE_SRC_EXPECTED = `/* Compiled with JS2EEL v0.0.1 */

desc:sinewave

slider1:freq=80 < 0, 440, 1 >Frequency [Hz]
slider2:voldb=-9 < -72, 0, 0.1 >Volume [dB]

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@slider

vol = (10 ^ (voldb / (20)));


@sample


/* Channel 0 */

spl0 = sin(2 * $pi * freq * t) * vol;

/* Channel 1 */

spl1 = sin(2 * $pi * freq * t) * vol;

t += 1 / (srate);


`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: Sinewave', () => {
    it('Compiles sine wave generator', () => {
        const result = js2EelCompiler.compile(JS_SINEWAVE_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_SINEWAVE_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
