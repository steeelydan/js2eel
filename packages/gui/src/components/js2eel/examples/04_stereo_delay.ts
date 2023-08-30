export const EXAMPLE_STEREO_DELAY_JS = {
    path: 'example://stereo_delay.js',
    src: `config({ description: 'stereo_delay', inChannels: 2, outChannels: 2 });

let lengthMsL;
let lengthMsR;
let mixDb;
let feedback;
let feedbackPercent;
let mix;

const buffer = new EelBuffer(2, 400000);
const numSamples = new EelArray(1, 2);
const bufferPos = new EelArray(1, 2);

slider(1, lengthMsL, 120, 0, 2000, 1, 'Delay L / Mono (ms)');
slider(2, lengthMsR, 120, 0, 2000, 1, 'Delay R (ms)');
slider(3, feedbackPercent, 0, 0, 100, 0.1, 'Feedback (%)');
slider(4, mixDb, -6, -120, 6, 0.01, 'Mix (dB)');

onSlider(() => {
    numSamples[0][0] = (lengthMsL * srate) / 1000;
    numSamples[0][1] = (lengthMsR * srate) / 1000;

    feedback = feedbackPercent / 100;

    mix = Math.pow(2, mixDb / 6);
});

onSample(() => {
    eachChannel((sample, ch) => {
        const bufferValue = buffer[ch][bufferPos[0][ch]];
        const delayVal = min(sample + bufferValue * feedback, 1);
        const currentBufPos = bufferPos[0][ch];
        buffer[ch][currentBufPos] = delayVal;
        bufferPos[0][ch] = currentBufPos + 1;

        if (bufferPos[0][ch] >= numSamples[0][ch]) {
            bufferPos[0][ch] = 0;
        }

        sample = sample + bufferValue * mix;
    });
});
`
};
