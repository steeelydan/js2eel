import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_LOWPASS_SRC = fs.readFileSync(path.resolve('../examples/05_lowpass.js'), 'utf-8');

const EEL_LOWPASS_SRC_EXPECTED = `/* Compiled with JS2EEL v0.8.0 */

desc:lowpass

slider1:lpFreq=22000 < 5, 22000, 1 >LP Freq
slider2:lpQ=0.5 < 0.1, 7, 0.01 >Q
slider50:outputGainDb=0 < -15, 15, 0.01 >Output Gain (dB)

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

lpCoefs__a1x = 0;
lpCoefs__a2x = 0;
lpCoefs__b0x = 0;
lpCoefs__b1x = 0;
lpCoefs__b2x = 0;


@slider

omega__S1 = 2 * $pi * lpFreq / (srate);
sinOmega__S1 = sin(omega__S1);
cosOmega__S1 = cos(omega__S1);
alpha__S1 = sinOmega__S1 / (2 * lpQ);
a0__S1 = (1 + alpha__S1);
a1__S1 = -2 * cosOmega__S1;
a2__S1 = (1 - alpha__S1);
b0__S1 = (1 - cosOmega__S1) / (2);
b1__S1 = (1 - cosOmega__S1);
b2__S1 = (1 - cosOmega__S1) / (2);
lpCoefs__a1x = a1__S1 / (a0__S1);
lpCoefs__a2x = a2__S1 / (a0__S1);
lpCoefs__b0x = b0__S1 / (a0__S1);
lpCoefs__b1x = b1__S1 / (a0__S1);
lpCoefs__b2x = b2__S1 / (a0__S1);

outputGain = (10 ^ (outputGainDb / (20)));


@sample


/* Channel 0 */

lpFreq < 22000 ? (
lpYStore__D0__0 = ((((lpCoefs__b0x * lpXStore__D0__0 + lpCoefs__b1x * lpXStore__D0__1) + lpCoefs__b2x * lpXStore__D0__2) - lpCoefs__a1x * lpYStore__D0__1) - lpCoefs__a2x * lpYStore__D0__2);
lpYStore__D0__2 = lpYStore__D0__1;
lpYStore__D0__1 = lpYStore__D0__0;
lpXStore__D0__2 = lpXStore__D0__1;
lpXStore__D0__1 = lpXStore__D0__0;
lpXStore__D0__0 = spl0;
R__S2__0 = lpYStore__D0__0;
spl0 = R__S2__0;
);
spl0 = spl0 * outputGain;

/* Channel 1 */

lpFreq < 22000 ? (
lpYStore__D1__0 = ((((lpCoefs__b0x * lpXStore__D1__0 + lpCoefs__b1x * lpXStore__D1__1) + lpCoefs__b2x * lpXStore__D1__2) - lpCoefs__a1x * lpYStore__D1__1) - lpCoefs__a2x * lpYStore__D1__2);
lpYStore__D1__2 = lpYStore__D1__1;
lpYStore__D1__1 = lpYStore__D1__0;
lpXStore__D1__2 = lpXStore__D1__1;
lpXStore__D1__1 = lpXStore__D1__0;
lpXStore__D1__0 = spl1;
R__S2__0 = lpYStore__D1__0;
spl1 = R__S2__0;
);
spl1 = spl1 * outputGain;



`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: Lowpass', () => {
    it('Compiles lowpass filter', () => {
        const result = js2EelCompiler.compile(JS_LOWPASS_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_LOWPASS_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
