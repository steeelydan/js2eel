import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_STEREO_DELAY_SRC = fs.readFileSync(
    path.resolve('../examples/04_stereo_delay.js'),
    'utf-8'
);

const EEL_STEREO_DELAY_SRC_EXPECTED = `/* Compiled with JS2EEL v0.0.15 */

desc:stereo_delay

slider1:lengthMsL=120 < 0, 2000, 1 >Delay L / Mono (ms)
slider2:lengthMsR=120 < 0, 2000, 1 >Delay R (ms)
slider3:feedbackPercent=0 < 0, 100, 0.1 >Feedback (%)
slider4:mixDb=-6 < -120, 6, 0.01 >Mix (dB)

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

buffer__B0 = 0 * 400000;
buffer__B1 = 1 * 400000;
buffer__size = 400000;


@slider

numSamples__D0__0 = lengthMsL * srate / (1000);
numSamples__D0__1 = lengthMsR * srate / (1000);
feedback = feedbackPercent / (100);
mix = 2 ^ (mixDb / (6));


@sample


/* Channel 0 */

CH__0 = 0;

bufferValue__S6 = buffer__B0[bufferPos__D0__0];
delayVal__S6 = min((spl0 + bufferValue__S6 * feedback), 1);
currentBufPos__S6 = bufferPos__D0__0;
buffer__B0[currentBufPos__S6] = delayVal__S6;
bufferPos__D0__0 = (currentBufPos__S6 + 1);
bufferPos__D0__0 >= numSamples__D0__0 ? (
bufferPos__D0__0 = 0;
);
spl0 = (spl0 + bufferValue__S6 * mix);

/* Channel 1 */

CH__1 = 1;

bufferValue__S8 = buffer__B1[bufferPos__D0__1];
delayVal__S8 = min((spl1 + bufferValue__S8 * feedback), 1);
currentBufPos__S8 = bufferPos__D0__1;
buffer__B1[currentBufPos__S8] = delayVal__S8;
bufferPos__D0__1 = (currentBufPos__S8 + 1);
bufferPos__D0__1 >= numSamples__D0__1 ? (
bufferPos__D0__1 = 0;
);
spl1 = (spl1 + bufferValue__S8 * mix);



`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: Stereo Delay', () => {
    it('Compiles stereo delay', () => {
        const result = js2EelCompiler.compile(JS_STEREO_DELAY_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_STEREO_DELAY_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
