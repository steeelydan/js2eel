config({ description: 'lowpass', inChannels: 2, outChannels: 2 });

let lpFreq;
let lpQ;

const lpCoefs = {
    a1x: 0,
    a2x: 0,
    b0x: 0,
    b1x: 0,
    b2x: 0
};

const lpXStore = new EelArray(2, 3);
const lpYStore = new EelArray(2, 3);

let outputGainDb;
let outputGain;

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

onSlider(() => {
    setLpCoefs();

    outputGain = 10 ** (outputGainDb / 20);
});

onSample(() => {
    eachChannel((sample, channel) => {
        function processSample(value) {
            lpYStore[channel][0] =
                lpCoefs.b0x * lpXStore[channel][0] +
                lpCoefs.b1x * lpXStore[channel][1] +
                lpCoefs.b2x * lpXStore[channel][2] -
                lpCoefs.a1x * lpYStore[channel][1] -
                lpCoefs.a2x * lpYStore[channel][2];

            lpYStore[channel][2] = lpYStore[channel][1];
            lpYStore[channel][1] = lpYStore[channel][0];
            lpXStore[channel][2] = lpXStore[channel][1];
            lpXStore[channel][1] = lpXStore[channel][0];
            lpXStore[channel][0] = value;

            return lpYStore[channel][0];
        }

        if (lpFreq < 22000) {
            sample = processSample(sample);
        }

        sample = sample * outputGain;
    });
});
