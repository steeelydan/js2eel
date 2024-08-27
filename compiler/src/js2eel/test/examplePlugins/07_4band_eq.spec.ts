import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_4BAND_EQ_SRC = fs.readFileSync(path.resolve('../examples/07_4band_eq.js'), 'utf-8');

const EEL_4BAND_EQ_SRC_EXPECTED = `/* Compiled with JS2EEL v0.10.0 */

desc:4band_eq

slider1:hpFreq=20 < 20, 1050, 1 >HP Freq
slider2:hpQ=0.5 < 0.1, 7, 0.01 >Q
slider4:lpFreq=22000 < 3000, 22000, 1 >LP Freq
slider5:lpQ=0.5 < 0.1, 7, 0.01 >Q
slider8:highFreq=8000 < 20, 20000, 1 >Freq
slider9:highQ=0.5 < 0.1, 7, 0.01 >Q
slider10:highGain=0 < -15, 15, 0.01 >Gain (dB)
slider12:hiMidFreq=3000 < 600, 7000, 1 >Hi Mid Freq
slider13:hiMidQ=0.5 < 0.1, 7, 0.01 >Q
slider14:hiMidGain=0 < -15, 15, 0.01 >Gain (dB)
slider16:loMidFreq=1000 < 200, 2500, 1 >Lo Mid Freq
slider17:loMidQ=0.5 < 0.1, 7, 0.01 >Q
slider18:loMidGain=0 < -15, 15, 0.01 >Gain (dB)
slider21:lowFreq=200 < 30, 450, 1 >Freq
slider22:lowQ=0.5 < 0.1, 7, 0.01 >Q
slider23:lowGain=0 < -15, 15, 0.01 >Gain (dB)
slider50:outputGainDb=0 < -15, 15, 0.01 >Output Gain (dB)

slider7:highType=0 < 0, 2, 1 {Shelf, Peak} >High Type
slider20:lowType=0 < 0, 2, 1 {Shelf, Peak} >Low Type

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

hpCoefs__a1x = 0;
hpCoefs__a2x = 0;
hpCoefs__b0x = 0;
hpCoefs__b1x = 0;
hpCoefs__b2x = 0;
lpCoefs__a1x = 0;
lpCoefs__a2x = 0;
lpCoefs__b0x = 0;
lpCoefs__b1x = 0;
lpCoefs__b2x = 0;
hiCoefs__a1x = 0;
hiCoefs__a2x = 0;
hiCoefs__b0x = 0;
hiCoefs__b1x = 0;
hiCoefs__b2x = 0;
hiShelfCoefs__a1x = 0;
hiShelfCoefs__a2x = 0;
hiShelfCoefs__b0x = 0;
hiShelfCoefs__b1x = 0;
hiShelfCoefs__b2x = 0;
hiMidCoefs__a1x = 0;
hiMidCoefs__a2x = 0;
hiMidCoefs__b0x = 0;
hiMidCoefs__b1x = 0;
hiMidCoefs__b2x = 0;
loMidCoefs__a1x = 0;
loMidCoefs__a2x = 0;
loMidCoefs__b0x = 0;
loMidCoefs__b1x = 0;
loMidCoefs__b2x = 0;
loCoefs__a1x = 0;
loCoefs__a2x = 0;
loCoefs__b0x = 0;
loCoefs__b1x = 0;
loCoefs__b2x = 0;
loShelfCoefs__a1x = 0;
loShelfCoefs__a2x = 0;
loShelfCoefs__b0x = 0;
loShelfCoefs__b1x = 0;
loShelfCoefs__b2x = 0;


@slider

omega__S2 = 2 * $pi * lpFreq / (srate);
sinOmega__S2 = sin(omega__S2);
cosOmega__S2 = cos(omega__S2);
alpha__S2 = sinOmega__S2 / (2 * lpQ);
a0__S2 = (1 + alpha__S2);
a1__S2 = -2 * cosOmega__S2;
a2__S2 = (1 - alpha__S2);
b0__S2 = (1 - cosOmega__S2) / (2);
b1__S2 = (1 - cosOmega__S2);
b2__S2 = (1 - cosOmega__S2) / (2);
lpCoefs__a1x = a1__S2 / (a0__S2);
lpCoefs__a2x = a2__S2 / (a0__S2);
lpCoefs__b0x = b0__S2 / (a0__S2);
lpCoefs__b1x = b1__S2 / (a0__S2);
lpCoefs__b2x = b2__S2 / (a0__S2);

A__S3 = (10 ^ (highGain / (40)));
omega__S3 = 2 * $pi * highFreq / (srate);
sinOmega__S3 = sin(omega__S3);
cosOmega__S3 = cos(omega__S3);
alpha__S3 = sinOmega__S3 / (2 * highQ);
a0__S3 = (1 + alpha__S3 / (A__S3));
a1__S3 = -2 * cosOmega__S3;
a2__S3 = (1 - alpha__S3 / (A__S3));
b0__S3 = (1 + alpha__S3 * A__S3);
b1__S3 = -2 * cosOmega__S3;
b2__S3 = (1 - alpha__S3 * A__S3);
hiCoefs__a1x = a1__S3 / (a0__S3);
hiCoefs__a2x = a2__S3 / (a0__S3);
hiCoefs__b0x = b0__S3 / (a0__S3);
hiCoefs__b1x = b1__S3 / (a0__S3);
hiCoefs__b2x = b2__S3 / (a0__S3);

A__S4 = (10 ^ (highGain / (40)));
omega__S4 = 2 * $pi * highFreq / (srate);
sinOmega__S4 = sin(omega__S4);
cosOmega__S4 = cos(omega__S4);
alpha__S4 = sinOmega__S4 / (2 * highQ);
a0__S4 = (((A__S4 + 1) - (A__S4 - 1) * cosOmega__S4) + 2 * sqrt(A__S4) * alpha__S4);
a1__S4 = 2 * ((A__S4 - 1) - (A__S4 + 1) * cosOmega__S4);
a2__S4 = (((A__S4 + 1) - (A__S4 - 1) * cosOmega__S4) - 2 * sqrt(A__S4) * alpha__S4);
b0__S4 = A__S4 * (((A__S4 + 1) + (A__S4 - 1) * cosOmega__S4) + 2 * sqrt(A__S4) * alpha__S4);
b1__S4 = -2 * A__S4 * ((A__S4 - 1) + (A__S4 + 1) * cosOmega__S4);
b2__S4 = A__S4 * (((A__S4 + 1) + (A__S4 - 1) * cosOmega__S4) - 2 * sqrt(A__S4) * alpha__S4);
hiShelfCoefs__a1x = a1__S4 / (a0__S4);
hiShelfCoefs__a2x = a2__S4 / (a0__S4);
hiShelfCoefs__b0x = b0__S4 / (a0__S4);
hiShelfCoefs__b1x = b1__S4 / (a0__S4);
hiShelfCoefs__b2x = b2__S4 / (a0__S4);

A__S3 = (10 ^ (hiMidGain / (40)));
omega__S3 = 2 * $pi * hiMidFreq / (srate);
sinOmega__S3 = sin(omega__S3);
cosOmega__S3 = cos(omega__S3);
alpha__S3 = sinOmega__S3 / (2 * hiMidQ);
a0__S3 = (1 + alpha__S3 / (A__S3));
a1__S3 = -2 * cosOmega__S3;
a2__S3 = (1 - alpha__S3 / (A__S3));
b0__S3 = (1 + alpha__S3 * A__S3);
b1__S3 = -2 * cosOmega__S3;
b2__S3 = (1 - alpha__S3 * A__S3);
hiMidCoefs__a1x = a1__S3 / (a0__S3);
hiMidCoefs__a2x = a2__S3 / (a0__S3);
hiMidCoefs__b0x = b0__S3 / (a0__S3);
hiMidCoefs__b1x = b1__S3 / (a0__S3);
hiMidCoefs__b2x = b2__S3 / (a0__S3);

A__S3 = (10 ^ (loMidGain / (40)));
omega__S3 = 2 * $pi * loMidFreq / (srate);
sinOmega__S3 = sin(omega__S3);
cosOmega__S3 = cos(omega__S3);
alpha__S3 = sinOmega__S3 / (2 * loMidQ);
a0__S3 = (1 + alpha__S3 / (A__S3));
a1__S3 = -2 * cosOmega__S3;
a2__S3 = (1 - alpha__S3 / (A__S3));
b0__S3 = (1 + alpha__S3 * A__S3);
b1__S3 = -2 * cosOmega__S3;
b2__S3 = (1 - alpha__S3 * A__S3);
loMidCoefs__a1x = a1__S3 / (a0__S3);
loMidCoefs__a2x = a2__S3 / (a0__S3);
loMidCoefs__b0x = b0__S3 / (a0__S3);
loMidCoefs__b1x = b1__S3 / (a0__S3);
loMidCoefs__b2x = b2__S3 / (a0__S3);

A__S3 = (10 ^ (lowGain / (40)));
omega__S3 = 2 * $pi * lowFreq / (srate);
sinOmega__S3 = sin(omega__S3);
cosOmega__S3 = cos(omega__S3);
alpha__S3 = sinOmega__S3 / (2 * lowQ);
a0__S3 = (1 + alpha__S3 / (A__S3));
a1__S3 = -2 * cosOmega__S3;
a2__S3 = (1 - alpha__S3 / (A__S3));
b0__S3 = (1 + alpha__S3 * A__S3);
b1__S3 = -2 * cosOmega__S3;
b2__S3 = (1 - alpha__S3 * A__S3);
loCoefs__a1x = a1__S3 / (a0__S3);
loCoefs__a2x = a2__S3 / (a0__S3);
loCoefs__b0x = b0__S3 / (a0__S3);
loCoefs__b1x = b1__S3 / (a0__S3);
loCoefs__b2x = b2__S3 / (a0__S3);

A__S5 = (10 ^ (lowGain / (40)));
omega__S5 = 2 * $pi * lowFreq / (srate);
sinOmega__S5 = sin(omega__S5);
cosOmega__S5 = cos(omega__S5);
alpha__S5 = sinOmega__S5 / (2 * lowQ);
a0__S5 = (((A__S5 + 1) + (A__S5 - 1) * cosOmega__S5) + 2 * sqrt(A__S5) * alpha__S5);
a1__S5 = -2 * ((A__S5 - 1) + (A__S5 + 1) * cosOmega__S5);
a2__S5 = (((A__S5 + 1) + (A__S5 - 1) * cosOmega__S5) - 2 * sqrt(A__S5) * alpha__S5);
b0__S5 = A__S5 * (((A__S5 + 1) - (A__S5 - 1) * cosOmega__S5) + 2 * sqrt(A__S5) * alpha__S5);
b1__S5 = 2 * A__S5 * ((A__S5 - 1) - (A__S5 + 1) * cosOmega__S5);
b2__S5 = A__S5 * (((A__S5 + 1) - (A__S5 - 1) * cosOmega__S5) - 2 * sqrt(A__S5) * alpha__S5);
loShelfCoefs__a1x = a1__S5 / (a0__S5);
loShelfCoefs__a2x = a2__S5 / (a0__S5);
loShelfCoefs__b0x = b0__S5 / (a0__S5);
loShelfCoefs__b1x = b1__S5 / (a0__S5);
loShelfCoefs__b2x = b2__S5 / (a0__S5);

omega__S1 = 2 * $pi * hpFreq / (srate);
sinOmega__S1 = sin(omega__S1);
cosOmega__S1 = cos(omega__S1);
alpha__S1 = sinOmega__S1 / (2 * hpQ);
a0__S1 = (1 + alpha__S1);
a1__S1 = -2 * cosOmega__S1;
a2__S1 = (1 - alpha__S1);
b0__S1 = (1 + cosOmega__S1) / (2);
b1__S1 = -(1 + cosOmega__S1);
b2__S1 = (1 + cosOmega__S1) / (2);
hpCoefs__a1x = a1__S1 / (a0__S1);
hpCoefs__a2x = a2__S1 / (a0__S1);
hpCoefs__b0x = b0__S1 / (a0__S1);
hpCoefs__b1x = b1__S1 / (a0__S1);
hpCoefs__b2x = b2__S1 / (a0__S1);

outputGain = (10 ^ (outputGainDb / (20)));


@sample


/* Channel 0 */

CH__0 = 0;

lpFreq < 22000 ? (
    lpYStore__D0__0 = ((((lpCoefs__b0x * lpXStore__D0__0 + lpCoefs__b1x * lpXStore__D0__1) + lpCoefs__b2x * lpXStore__D0__2) - lpCoefs__a1x * lpYStore__D0__1) - lpCoefs__a2x * lpYStore__D0__2);
    lpYStore__D0__2 = lpYStore__D0__1;
    lpYStore__D0__1 = lpYStore__D0__0;
    lpXStore__D0__2 = lpXStore__D0__1;
    lpXStore__D0__1 = lpXStore__D0__0;
    lpXStore__D0__0 = spl0;
    R__S6__0 = lpYStore__D0__0;
    spl0 = R__S6__0;
);
highGain !== 0 ? (
    highType == 1 ? (
        hiYStore__D0__0 = ((((hiCoefs__b0x * hiXStore__D0__0 + hiCoefs__b1x * hiXStore__D0__1) + hiCoefs__b2x * hiXStore__D0__2) - hiCoefs__a1x * hiYStore__D0__1) - hiCoefs__a2x * hiYStore__D0__2);
        hiYStore__D0__2 = hiYStore__D0__1;
        hiYStore__D0__1 = hiYStore__D0__0;
        hiXStore__D0__2 = hiXStore__D0__1;
        hiXStore__D0__1 = hiXStore__D0__0;
        hiXStore__D0__0 = spl0;
        R__S6__0 = hiYStore__D0__0;
        spl0 = R__S6__0;
    ) : (
        hiShelfYStore__D0__0 = ((((hiShelfCoefs__b0x * hiShelfXStore__D0__0 + hiShelfCoefs__b1x * hiShelfXStore__D0__1) + hiShelfCoefs__b2x * hiShelfXStore__D0__2) - hiShelfCoefs__a1x * hiShelfYStore__D0__1) - hiShelfCoefs__a2x * hiShelfYStore__D0__2);
        hiShelfYStore__D0__2 = hiShelfYStore__D0__1;
        hiShelfYStore__D0__1 = hiShelfYStore__D0__0;
        hiShelfXStore__D0__2 = hiShelfXStore__D0__1;
        hiShelfXStore__D0__1 = hiShelfXStore__D0__0;
        hiShelfXStore__D0__0 = spl0;
        R__S6__0 = hiShelfYStore__D0__0;
        spl0 = R__S6__0;
    );
);
hiMidGain !== 0 ? (
    hiMidYStore__D0__0 = ((((hiMidCoefs__b0x * hiMidXStore__D0__0 + hiMidCoefs__b1x * hiMidXStore__D0__1) + hiMidCoefs__b2x * hiMidXStore__D0__2) - hiMidCoefs__a1x * hiMidYStore__D0__1) - hiMidCoefs__a2x * hiMidYStore__D0__2);
    hiMidYStore__D0__2 = hiMidYStore__D0__1;
    hiMidYStore__D0__1 = hiMidYStore__D0__0;
    hiMidXStore__D0__2 = hiMidXStore__D0__1;
    hiMidXStore__D0__1 = hiMidXStore__D0__0;
    hiMidXStore__D0__0 = spl0;
    R__S6__0 = hiMidYStore__D0__0;
    spl0 = R__S6__0;
);
loMidGain !== 0 ? (
    loMidYStore__D0__0 = ((((loMidCoefs__b0x * loMidXStore__D0__0 + loMidCoefs__b1x * loMidXStore__D0__1) + loMidCoefs__b2x * loMidXStore__D0__2) - loMidCoefs__a1x * loMidYStore__D0__1) - loMidCoefs__a2x * loMidYStore__D0__2);
    loMidYStore__D0__2 = loMidYStore__D0__1;
    loMidYStore__D0__1 = loMidYStore__D0__0;
    loMidXStore__D0__2 = loMidXStore__D0__1;
    loMidXStore__D0__1 = loMidXStore__D0__0;
    loMidXStore__D0__0 = spl0;
    R__S6__0 = loMidYStore__D0__0;
    spl0 = R__S6__0;
);
lowGain !== 0 ? (
    lowType == 1 ? (
        loYStore__D0__0 = ((((loCoefs__b0x * loXStore__D0__0 + loCoefs__b1x * loXStore__D0__1) + loCoefs__b2x * loXStore__D0__2) - loCoefs__a1x * loYStore__D0__1) - loCoefs__a2x * loYStore__D0__2);
        loYStore__D0__2 = loYStore__D0__1;
        loYStore__D0__1 = loYStore__D0__0;
        loXStore__D0__2 = loXStore__D0__1;
        loXStore__D0__1 = loXStore__D0__0;
        loXStore__D0__0 = spl0;
        R__S6__0 = loYStore__D0__0;
        spl0 = R__S6__0;
    ) : (
        loShelfYStore__D0__0 = ((((loShelfCoefs__b0x * loShelfXStore__D0__0 + loShelfCoefs__b1x * loShelfXStore__D0__1) + loShelfCoefs__b2x * loShelfXStore__D0__2) - loShelfCoefs__a1x * loShelfYStore__D0__1) - loShelfCoefs__a2x * loShelfYStore__D0__2);
        loShelfYStore__D0__2 = loShelfYStore__D0__1;
        loShelfYStore__D0__1 = loShelfYStore__D0__0;
        loShelfXStore__D0__2 = loShelfXStore__D0__1;
        loShelfXStore__D0__1 = loShelfXStore__D0__0;
        loShelfXStore__D0__0 = spl0;
        R__S6__0 = loShelfYStore__D0__0;
        spl0 = R__S6__0;
    );
);
hpFreq > 20 ? (
    hpYStore__D0__0 = ((((hpCoefs__b0x * hpXStore__D0__0 + hpCoefs__b1x * hpXStore__D0__1) + hpCoefs__b2x * hpXStore__D0__2) - hpCoefs__a1x * hpYStore__D0__1) - hpCoefs__a2x * hpYStore__D0__2);
    hpYStore__D0__2 = hpYStore__D0__1;
    hpYStore__D0__1 = hpYStore__D0__0;
    hpXStore__D0__2 = hpXStore__D0__1;
    hpXStore__D0__1 = hpXStore__D0__0;
    hpXStore__D0__0 = spl0;
    R__S6__0 = hpYStore__D0__0;
    spl0 = R__S6__0;
);
spl0 = spl0 * outputGain;

/* Channel 1 */

CH__1 = 1;

lpFreq < 22000 ? (
    lpYStore__D1__0 = ((((lpCoefs__b0x * lpXStore__D1__0 + lpCoefs__b1x * lpXStore__D1__1) + lpCoefs__b2x * lpXStore__D1__2) - lpCoefs__a1x * lpYStore__D1__1) - lpCoefs__a2x * lpYStore__D1__2);
    lpYStore__D1__2 = lpYStore__D1__1;
    lpYStore__D1__1 = lpYStore__D1__0;
    lpXStore__D1__2 = lpXStore__D1__1;
    lpXStore__D1__1 = lpXStore__D1__0;
    lpXStore__D1__0 = spl1;
    R__S6__0 = lpYStore__D1__0;
    spl1 = R__S6__0;
);
highGain !== 0 ? (
    highType == 1 ? (
        hiYStore__D1__0 = ((((hiCoefs__b0x * hiXStore__D1__0 + hiCoefs__b1x * hiXStore__D1__1) + hiCoefs__b2x * hiXStore__D1__2) - hiCoefs__a1x * hiYStore__D1__1) - hiCoefs__a2x * hiYStore__D1__2);
        hiYStore__D1__2 = hiYStore__D1__1;
        hiYStore__D1__1 = hiYStore__D1__0;
        hiXStore__D1__2 = hiXStore__D1__1;
        hiXStore__D1__1 = hiXStore__D1__0;
        hiXStore__D1__0 = spl1;
        R__S6__0 = hiYStore__D1__0;
        spl1 = R__S6__0;
    ) : (
        hiShelfYStore__D1__0 = ((((hiShelfCoefs__b0x * hiShelfXStore__D1__0 + hiShelfCoefs__b1x * hiShelfXStore__D1__1) + hiShelfCoefs__b2x * hiShelfXStore__D1__2) - hiShelfCoefs__a1x * hiShelfYStore__D1__1) - hiShelfCoefs__a2x * hiShelfYStore__D1__2);
        hiShelfYStore__D1__2 = hiShelfYStore__D1__1;
        hiShelfYStore__D1__1 = hiShelfYStore__D1__0;
        hiShelfXStore__D1__2 = hiShelfXStore__D1__1;
        hiShelfXStore__D1__1 = hiShelfXStore__D1__0;
        hiShelfXStore__D1__0 = spl1;
        R__S6__0 = hiShelfYStore__D1__0;
        spl1 = R__S6__0;
    );
);
hiMidGain !== 0 ? (
    hiMidYStore__D1__0 = ((((hiMidCoefs__b0x * hiMidXStore__D1__0 + hiMidCoefs__b1x * hiMidXStore__D1__1) + hiMidCoefs__b2x * hiMidXStore__D1__2) - hiMidCoefs__a1x * hiMidYStore__D1__1) - hiMidCoefs__a2x * hiMidYStore__D1__2);
    hiMidYStore__D1__2 = hiMidYStore__D1__1;
    hiMidYStore__D1__1 = hiMidYStore__D1__0;
    hiMidXStore__D1__2 = hiMidXStore__D1__1;
    hiMidXStore__D1__1 = hiMidXStore__D1__0;
    hiMidXStore__D1__0 = spl1;
    R__S6__0 = hiMidYStore__D1__0;
    spl1 = R__S6__0;
);
loMidGain !== 0 ? (
    loMidYStore__D1__0 = ((((loMidCoefs__b0x * loMidXStore__D1__0 + loMidCoefs__b1x * loMidXStore__D1__1) + loMidCoefs__b2x * loMidXStore__D1__2) - loMidCoefs__a1x * loMidYStore__D1__1) - loMidCoefs__a2x * loMidYStore__D1__2);
    loMidYStore__D1__2 = loMidYStore__D1__1;
    loMidYStore__D1__1 = loMidYStore__D1__0;
    loMidXStore__D1__2 = loMidXStore__D1__1;
    loMidXStore__D1__1 = loMidXStore__D1__0;
    loMidXStore__D1__0 = spl1;
    R__S6__0 = loMidYStore__D1__0;
    spl1 = R__S6__0;
);
lowGain !== 0 ? (
    lowType == 1 ? (
        loYStore__D1__0 = ((((loCoefs__b0x * loXStore__D1__0 + loCoefs__b1x * loXStore__D1__1) + loCoefs__b2x * loXStore__D1__2) - loCoefs__a1x * loYStore__D1__1) - loCoefs__a2x * loYStore__D1__2);
        loYStore__D1__2 = loYStore__D1__1;
        loYStore__D1__1 = loYStore__D1__0;
        loXStore__D1__2 = loXStore__D1__1;
        loXStore__D1__1 = loXStore__D1__0;
        loXStore__D1__0 = spl1;
        R__S6__0 = loYStore__D1__0;
        spl1 = R__S6__0;
    ) : (
        loShelfYStore__D1__0 = ((((loShelfCoefs__b0x * loShelfXStore__D1__0 + loShelfCoefs__b1x * loShelfXStore__D1__1) + loShelfCoefs__b2x * loShelfXStore__D1__2) - loShelfCoefs__a1x * loShelfYStore__D1__1) - loShelfCoefs__a2x * loShelfYStore__D1__2);
        loShelfYStore__D1__2 = loShelfYStore__D1__1;
        loShelfYStore__D1__1 = loShelfYStore__D1__0;
        loShelfXStore__D1__2 = loShelfXStore__D1__1;
        loShelfXStore__D1__1 = loShelfXStore__D1__0;
        loShelfXStore__D1__0 = spl1;
        R__S6__0 = loShelfYStore__D1__0;
        spl1 = R__S6__0;
    );
);
hpFreq > 20 ? (
    hpYStore__D1__0 = ((((hpCoefs__b0x * hpXStore__D1__0 + hpCoefs__b1x * hpXStore__D1__1) + hpCoefs__b2x * hpXStore__D1__2) - hpCoefs__a1x * hpYStore__D1__1) - hpCoefs__a2x * hpYStore__D1__2);
    hpYStore__D1__2 = hpYStore__D1__1;
    hpYStore__D1__1 = hpYStore__D1__0;
    hpXStore__D1__2 = hpXStore__D1__1;
    hpXStore__D1__1 = hpXStore__D1__0;
    hpXStore__D1__0 = spl1;
    R__S6__0 = hpYStore__D1__0;
    spl1 = R__S6__0;
);
spl1 = spl1 * outputGain;



`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: 4 Band EQ', () => {
    it('Compiles 4 band eq plugin', () => {
        const result = js2EelCompiler.compile(JS_4BAND_EQ_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_4BAND_EQ_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
