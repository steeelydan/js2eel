export const EXAMPLE_4BAND_EQ_JS = {
    path: 'example://4band_eq.js',
    src: `config({ description: '4band_eq', inChannels: 2, outChannels: 2 });

let hpFreq;
let hpQ;
let lpFreq;
let lpQ;
let highType;
let highFreq;
let highQ;
let highGain;
let hiMidFreq;
let hiMidQ;
let hiMidGain;
let loMidFreq;
let loMidQ;
let loMidGain;
let lowType;
let lowFreq;
let lowQ;
let lowGain;

let outputGainDb;
let outputGain;

const hpCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};
const lpCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};
const hiCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};
const hiShelfCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};
const hiMidCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};
const loMidCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};
const loCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};
const loShelfCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};

const hpXStore = new EelArray(2, 3);
const hpYStore = new EelArray(2, 3);
const lpXStore = new EelArray(2, 3);
const lpYStore = new EelArray(2, 3);
const hiXStore = new EelArray(2, 3);
const hiYStore = new EelArray(2, 3);
const hiShelfXStore = new EelArray(2, 3);
const hiShelfYStore = new EelArray(2, 3);
const hiMidXStore = new EelArray(2, 3);
const hiMidYStore = new EelArray(2, 3);
const loMidXStore = new EelArray(2, 3);
const loMidYStore = new EelArray(2, 3);
const loXStore = new EelArray(2, 3);
const loYStore = new EelArray(2, 3);
const loShelfXStore = new EelArray(2, 3);
const loShelfYStore = new EelArray(2, 3);

slider(1, hpFreq, 20, 20, 1050, 1, 'HP Freq');
slider(2, hpQ, 0.5, 0.1, 7, 0.01, 'Q');

slider(4, lpFreq, 22000, 3000, 22000, 1, 'LP Freq');
slider(5, lpQ, 0.5, 0.1, 7, 0.01, 'Q');

selectBox(
    7,
    highType,
    'shelf',
    [
        { name: 'shelf', label: 'Shelf' },
        { name: 'peak', label: 'Peak' }
    ],
    'High Type'
);
slider(8, highFreq, 8000, 20, 20000, 1, 'Freq');
slider(9, highQ, 0.5, 0.1, 7, 0.01, 'Q');
slider(10, highGain, 0, -15, 15, 0.01, 'Gain (dB)');

slider(12, hiMidFreq, 3000, 600, 7000, 1, 'Hi Mid Freq');
slider(13, hiMidQ, 0.5, 0.1, 7, 0.01, 'Q');
slider(14, hiMidGain, 0, -15, 15, 0.01, 'Gain (dB)');

slider(16, loMidFreq, 1000, 200, 2500, 1, 'Lo Mid Freq');
slider(17, loMidQ, 0.5, 0.1, 7, 0.01, 'Q');
slider(18, loMidGain, 0, -15, 15, 0.01, 'Gain (dB)');

selectBox(
    20,
    lowType,
    'shelf',
    [
        { name: 'shelf', label: 'Shelf' },
        { name: 'peak', label: 'Peak' }
    ],
    'Low Type'
);
slider(21, lowFreq, 200, 30, 450, 1, 'Freq');
slider(22, lowQ, 0.5, 0.1, 7, 0.01, 'Q');
slider(23, lowGain, 0, -15, 15, 0.01, 'Gain (dB)');

slider(50, outputGainDb, 0, -15, 15, 0.01, 'Output Gain (dB)');

function setHpCoefs() {
    const omega = (2 * $pi * hpFreq) / srate;
    const sinOmega = sin(omega);
    const cosOmega = cos(omega);
    const alpha = sinOmega / (2 * hpQ);

    const a0 = 1 + alpha;
    const a1 = -2 * cosOmega;
    const a2 = 1 - alpha;
    const b0 = (1 + cosOmega) / 2;
    const b1 = -(1 + cosOmega);
    const b2 = (1 + cosOmega) / 2;

    hpCoefs.a1x = a1 / a0;
    hpCoefs.a2x = a2 / a0;
    hpCoefs.b0x = b0 / a0;
    hpCoefs.b1x = b1 / a0;
    hpCoefs.b2x = b2 / a0;
}

function setLpCoefs() {
    const omega = (2 * $pi * lpFreq) / srate;
    const sinOmega = sin(omega);
    const cosOmega = cos(omega);
    const alpha = sinOmega / (2 * lpQ);

    const a0 = 1 + alpha;
    const a1 = -2 * cosOmega;
    const a2 = 1 - alpha;
    const b0 = (1 - cosOmega) / 2;
    const b1 = 1 - cosOmega;
    const b2 = (1 - cosOmega) / 2;

    lpCoefs.a1x = a1 / a0;
    lpCoefs.a2x = a2 / a0;
    lpCoefs.b0x = b0 / a0;
    lpCoefs.b1x = b1 / a0;
    lpCoefs.b2x = b2 / a0;
}

function setPeakCoefs(targetCoefs, freq, gain, q) {
    const A = 10 ** (gain / 40);
    const omega = (2 * $pi * freq) / srate;
    const sinOmega = sin(omega);
    const cosOmega = cos(omega);
    const alpha = sinOmega / (2 * q);

    const a0 = 1 + alpha / A;
    const a1 = -2 * cosOmega;
    const a2 = 1 - alpha / A;
    const b0 = 1 + alpha * A;
    const b1 = -2 * cosOmega;
    const b2 = 1 - alpha * A;

    targetCoefs.a1x = a1 / a0;
    targetCoefs.a2x = a2 / a0;
    targetCoefs.b0x = b0 / a0;
    targetCoefs.b1x = b1 / a0;
    targetCoefs.b2x = b2 / a0;
}

function setHighShelfCoefs() {
    const A = 10 ** (highGain / 40);
    const omega = (2 * $pi * highFreq) / srate;
    const sinOmega = sin(omega);
    const cosOmega = cos(omega);
    const alpha = sinOmega / (2 * highQ);

    const a0 = A + 1 - (A - 1) * cosOmega + 2 * sqrt(A) * alpha;
    const a1 = 2 * (A - 1 - (A + 1) * cosOmega);
    const a2 = A + 1 - (A - 1) * cosOmega - 2 * sqrt(A) * alpha;
    const b0 = A * (A + 1 + (A - 1) * cosOmega + 2 * sqrt(A) * alpha);
    const b1 = -2 * A * (A - 1 + (A + 1) * cosOmega);
    const b2 = A * (A + 1 + (A - 1) * cosOmega - 2 * sqrt(A) * alpha);

    hiShelfCoefs.a1x = a1 / a0;
    hiShelfCoefs.a2x = a2 / a0;
    hiShelfCoefs.b0x = b0 / a0;
    hiShelfCoefs.b1x = b1 / a0;
    hiShelfCoefs.b2x = b2 / a0;
}

function setLowShelfCoefs() {
    const A = 10 ** (lowGain / 40);
    const omega = (2 * $pi * lowFreq) / srate;
    const sinOmega = sin(omega);
    const cosOmega = cos(omega);
    const alpha = sinOmega / (2 * lowQ);

    const a0 = A + 1 + (A - 1) * cosOmega + 2 * sqrt(A) * alpha;
    const a1 = -2 * (A - 1 + (A + 1) * cosOmega);
    const a2 = A + 1 + (A - 1) * cosOmega - 2 * sqrt(A) * alpha;
    const b0 = A * (A + 1 - (A - 1) * cosOmega + 2 * sqrt(A) * alpha);
    const b1 = 2 * A * (A - 1 - (A + 1) * cosOmega);
    const b2 = A * (A + 1 - (A - 1) * cosOmega - 2 * sqrt(A) * alpha);

    loShelfCoefs.a1x = a1 / a0;
    loShelfCoefs.a2x = a2 / a0;
    loShelfCoefs.b0x = b0 / a0;
    loShelfCoefs.b1x = b1 / a0;
    loShelfCoefs.b2x = b2 / a0;
}

function processSample(value, ch, coefs, xStore, yStore) {
    yStore[ch][0] =
        coefs.b0x * xStore[ch][0] +
        coefs.b1x * xStore[ch][1] +
        coefs.b2x * xStore[ch][2] -
        coefs.a1x * yStore[ch][1] -
        coefs.a2x * yStore[ch][2];

    yStore[ch][2] = yStore[ch][1];
    yStore[ch][1] = yStore[ch][0];
    xStore[ch][2] = xStore[ch][1];
    xStore[ch][1] = xStore[ch][0];
    xStore[ch][0] = value;

    return yStore[ch][0];
}

onSlider(() => {
    setLpCoefs();
    setPeakCoefs(hiCoefs, highFreq, highGain, highQ);
    setHighShelfCoefs();
    setPeakCoefs(hiMidCoefs, hiMidFreq, hiMidGain, hiMidQ);
    setPeakCoefs(loMidCoefs, loMidFreq, loMidGain, loMidQ);
    setPeakCoefs(loCoefs, lowFreq, lowGain, lowQ);
    setLowShelfCoefs();
    setHpCoefs();

    outputGain = 10 ** (outputGainDb / 20);
});

onSample(() => {
    eachChannel((sample, ch) => {
        if (lpFreq < 22000) {
            sample = processSample(sample, ch, lpCoefs, lpXStore, lpYStore);
        }

        if (highGain !== 0) {
            if (highType === 'peak') {
                sample = processSample(sample, ch, hiCoefs, hiXStore, hiYStore);
            } else {
                sample = processSample(sample, ch, hiShelfCoefs, hiShelfXStore, hiShelfYStore);
            }
        }

        if (hiMidGain !== 0) {
            sample = processSample(sample, ch, hiMidCoefs, hiMidXStore, hiMidYStore);
        }

        if (loMidGain !== 0) {
            sample = processSample(sample, ch, loMidCoefs, loMidXStore, loMidYStore);
        }

        if (lowGain !== 0) {
            if (lowType === 'peak') {
                sample = processSample(sample, ch, loCoefs, loXStore, loYStore);
            } else {
                sample = processSample(sample, ch, loShelfCoefs, loShelfXStore, loShelfYStore);
            }
        }

        if (hpFreq > 20) {
            sample = processSample(sample, ch, hpCoefs, hpXStore, hpYStore);
        }

        sample = sample * outputGain;
    });
});
`
};
