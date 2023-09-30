config({ description: 'lowpass', inChannels: 2, outChannels: 2 });

let lpFreq;
let lpQ;
let outputGainDb;
let outputGain;

const lpCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};

const lpXStore = new EelArray(2, 3);
const lpYStore = new EelArray(2, 3);

slider(1, lpFreq, 22000, 5, 22000, 1, 'LP Freq');
slider(2, lpQ, 0.5, 0.1, 7, 0.01, 'Q');
slider(50, outputGainDb, 0, -15, 15, 0.01, 'Output Gain (dB)');

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

    outputGain = 10 ** (outputGainDb / 20);
});

onSample(() => {
    eachChannel((sample, ch) => {
        if (lpFreq < 22000) {
            sample = processSample(sample, ch, lpCoefs, lpXStore, lpYStore);
        }

        sample = sample * outputGain;
    });
});
