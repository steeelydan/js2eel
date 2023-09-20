import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_LOWPASS_SRC = fs.readFileSync(path.resolve('../examples/05_lowpass.js'), 'utf-8');

const EEL_LOWPASS_SRC_EXPECTED = `/* Compiled with JS2EEL v0.0.15 */

desc:lowpass

slider1:freq=300 < 20, 20000, 1 >Freq [Hz]
slider2:q=1 < 0.1, 7, 0.01 >Q

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@slider

omega = 2 * $pi * freq / (srate);
sinOmega = sin(omega);
cosOmega = cos(omega);
alpha = sinOmega / (2 * q);
b0 = (1 - cosOmega) / (2);
b1 = (1 - cosOmega);
b2 = (1 - cosOmega) / (2);
a0 = (1 + alpha);
a1 = -2 * cosOmega;
a2 = (1 - alpha);



@sample


/* Channel 0 */

YArray__D0__2 = YArray__D0__1;
YArray__D0__1 = YArray__D0__0;
YArray__D0__0 = ((((b0 / (a0) * XArray__D0__0 + b1 / (a0) * XArray__D0__1) + b2 / (a0) * XArray__D0__2) - a1 / (a0) * YArray__D0__1) - a2 / (a0) * YArray__D0__2);
XArray__D0__2 = XArray__D0__1;
XArray__D0__1 = XArray__D0__0;
XArray__D0__0 = spl0;
spl0 = YArray__D0__0;

/* Channel 1 */

YArray__D1__2 = YArray__D1__1;
YArray__D1__1 = YArray__D1__0;
YArray__D1__0 = ((((b0 / (a0) * XArray__D1__0 + b1 / (a0) * XArray__D1__1) + b2 / (a0) * XArray__D1__2) - a1 / (a0) * YArray__D1__1) - a2 / (a0) * YArray__D1__2);
XArray__D1__2 = XArray__D1__1;
XArray__D1__1 = XArray__D1__0;
XArray__D1__0 = spl1;
spl1 = YArray__D1__0;



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
