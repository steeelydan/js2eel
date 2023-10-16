import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_STEREO_DELAY_SRC = fs.readFileSync(
    path.resolve('../examples/04_stereo_delay.js'),
    'utf-8'
);

const EEL_STEREO_DELAY_SRC_EXPECTED = `/* Compiled with JS2EEL v0.9.1 */

desc:stereo_delay

slider2:lengthMsL=120 < 0, 2000, 1 >Delay L / Mono (ms)
slider3:lengthMsR=120 < 0, 2000, 1 >Delay R (ms)
slider4:feedbackPercent=0 < 0, 100, 0.1 >Feedback (%)
slider5:mixDb=-6 < -120, 6, 0.01 >Mix (dB)

slider1:type=0 < 0, 3, 1 {Mono, Stereo, Ping Pong} >Type

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

numSamples__L = 0;
numSamples__R = 0;
bufferPos__L = 0;
bufferPos__R = 0;
buffer__B0 = 0 * 400000 + 0;
buffer__B1 = 1 * 400000 + 0;
buffer__size = 400000;


@slider

feedback = feedbackPercent / (100);
numSamples__L = lengthMsL * srate / (1000);
numSamples__R = lengthMsR * srate / (1000);
(type == 0 || type == 2) ? (
lengthMsR = lengthMsL;
);
mix = 2 ^ (mixDb / (6));


@sample

bufferValueL__S5 = buffer__B0[bufferPos__L];
bufferValueR__S5 = buffer__B1[bufferPos__R];
type == 2 ? (
buffer__B1[bufferPos__R] = min((spl0 + bufferValueL__S5 * feedback), 1);
buffer__B0[bufferPos__L] = min((spl1 + bufferValueR__S5 * feedback), 1);
) : (buffer__B0[bufferPos__L] = min((spl0 + bufferValueL__S5 * feedback), 1);
buffer__B1[bufferPos__R] = min((spl1 + bufferValueR__S5 * feedback), 1);
);
bufferPos__L += 1;
bufferPos__R += 1;
bufferPos__L >= numSamples__L ? (
bufferPos__L = 0;
);
bufferPos__R >= numSamples__R ? (
bufferPos__R = 0;
);
spl0 = (spl0 + bufferValueL__S5 * mix);
spl1 = (spl1 + bufferValueR__S5 * mix);


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
