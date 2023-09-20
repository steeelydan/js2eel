import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_MONO_DELAY_SRC = fs.readFileSync(path.resolve('../examples/03_mono_delay.js'), 'utf-8');

const EEL_MONO_DELAY_SRC_EXPECTED = `/* Compiled with JS2EEL v0.0.15 */

desc:mono_delay

slider1:lengthMs=120 < 0, 2000, 1 >Delay (ms)
slider2:mixDb=-6 < -120, 6, 1 >Mix (dB)

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

readIndex = 0;
writeIndex = 0;
bufferValue = 0;
buffer__B0 = 0 * 400000;
buffer__B1 = 1 * 400000;
buffer__size = 400000;


@slider

numSamples = lengthMs * srate / (1000);
mix = 2 ^ (mixDb / (6));


@sample

readIndex = (writeIndex - numSamples);
readIndex < 0 ? (
readIndex += buffer__size;
);
writeIndex += 1;
writeIndex >= buffer__size ? (
writeIndex = 0;
);

/* Channel 0 */

bufferValue = buffer__B0[readIndex];
buffer__B0[writeIndex] = spl0;
spl0 = (spl0 + bufferValue * mix);

/* Channel 1 */

bufferValue = buffer__B1[readIndex];
buffer__B1[writeIndex] = spl1;
spl1 = (spl1 + bufferValue * mix);



`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: Simple Mono Delay', () => {
    it('Compiles simple mono delay', () => {
        const result = js2EelCompiler.compile(JS_MONO_DELAY_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_MONO_DELAY_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
