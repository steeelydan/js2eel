export const EXAMPLE_LOWPASS_JS = {
    path: 'example://lowpass.js',
    src: `config({ description: 'lowpass', inChannels: 2, outChannels: 2 });

let freq;
let q;

let omega;
let sinOmega;
let cosOmega;
let alpha;

const XArray = new EelArray(2, 3);
const YArray = new EelArray(2, 3);

let b0;
let b1;
let b2;
let a0;
let a1;
let a2;

slider(1, freq, 300, 20, 20000, 1, 'Freq [Hz]');
slider(2, q, 1, 0.1, 7, 0.01, 'Q');

function calcCoeffs() {
    // https://www.w3.org/TR/audio-eq-cookbook/

    omega = (2 * $pi) * (freq / srate);
    sinOmega = sin(omega);
    cosOmega = cos(omega);
    alpha = sinOmega / (2 * q);

    b0 = (1 - cosOmega) / 2;
    b1 = 1 - cosOmega;
    b2 = (1 - cosOmega) / 2;
    a0 = 1 + alpha;
    a1 = -2 * cosOmega;
    a2 = 1 - alpha;
}

onSlider(() => {
    calcCoeffs();
});

onSample(() => {
    eachChannel((sample, ch) => {
        YArray[ch][2] = YArray[ch][1];
        YArray[ch][1] = YArray[ch][0];
        YArray[ch][0] =
            (b0 / a0) * XArray[ch][0] +
            (b1 / a0) * XArray[ch][1] +
            (b2 / a0) * XArray[ch][2] -
            (a1 / a0) * YArray[ch][1] -
            (a2 / a0) * YArray[ch][2];
        XArray[ch][2] = XArray[ch][1];
        XArray[ch][1] = XArray[ch][0];
        XArray[ch][0] = sample;
        sample = YArray[ch][0];
    });
});
`
};
