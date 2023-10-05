export const EXAMPLE_STEREO_DELAY_JS = {
    path: 'example://stereo_delay.js',
    src: `config({ description: 'stereo_delay', inChannels: 2, outChannels: 2 });

let type;
let lengthMsL;
let lengthMsR;
let mixDb;
let feedback;
let feedbackPercent;
let mix;

const buffer = new EelBuffer(2, 400000);

const numSamples = {
    L: 0,
    R: 0
};
const bufferPos = {
    L: 0,
    R: 0
};

selectBox(
    1,
    type,
    'mono',
    [
        { name: 'mono', label: 'Mono' },
        { name: 'stereo', label: 'Stereo' },
        { name: 'pingpong', label: 'Ping Pong' }
    ],
    'Type'
);
slider(2, lengthMsL, 120, 0, 2000, 1, 'Delay L / Mono (ms)');
slider(3, lengthMsR, 120, 0, 2000, 1, 'Delay R (ms)');
slider(4, feedbackPercent, 0, 0, 100, 0.1, 'Feedback (%)');
slider(5, mixDb, -6, -120, 6, 0.01, 'Mix (dB)');

onSlider(() => {
    feedback = feedbackPercent / 100;

    numSamples.L = (lengthMsL * srate) / 1000;
    numSamples.R = (lengthMsR * srate) / 1000;

    if (type === 'mono' || type === 'pingpong') {
        lengthMsR = lengthMsL;
    }

    mix = Math.pow(2, mixDb / 6);
});

onSample(() => {
    const bufferValueL = buffer[0][bufferPos.L];
    const bufferValueR = buffer[1][bufferPos.R];

    if (type === 'pingpong') {
        buffer[1][bufferPos.R] = min(spl0 + bufferValueL * feedback, 1);
        buffer[0][bufferPos.L] = min(spl1 + bufferValueR * feedback, 1);
    } else {
        buffer[0][bufferPos.L] = min(spl0 + bufferValueL * feedback, 1);
        buffer[1][bufferPos.R] = min(spl1 + bufferValueR * feedback, 1);
    }

    bufferPos.L += 1;
    bufferPos.R += 1;

    if (bufferPos.L >= numSamples.L) {
        bufferPos.L = 0;
    }
    if (bufferPos.R >= numSamples.R) {
        bufferPos.R = 0;
    }

    spl0 = spl0 + bufferValueL * mix;
    spl1 = spl1 + bufferValueR * mix;
});
`
};
