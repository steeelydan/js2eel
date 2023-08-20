config({ description: 'mono_delay', inChannels: 2, outChannels: 2 });

let lengthMs;
let mixDb;
let numSamples;
let mix;
let readIndex = 0;
let writeIndex = 0;
let bufferValue = 0;

const buffer = new EelBuffer(2, 400000);

slider(1, lengthMs, 120, 0, 2000, 1, 'Delay (ms)');
slider(2, mixDb, -6, -120, 6, 1, 'Mix (dB)');

onSlider(() => {
    numSamples = (lengthMs * srate) / 1000;
    mix = Math.pow(2, mixDb / 6);
});

onSample(() => {
    readIndex = writeIndex - numSamples;

    if (readIndex < 0) {
        readIndex += buffer.size();
    }

    writeIndex += 1;

    if (writeIndex >= buffer.size()) {
        writeIndex = 0;
    }

    eachChannel((sample, ch) => {
        bufferValue = buffer[ch][readIndex];

        buffer[ch][writeIndex] = sample;

        sample = sample + bufferValue * mix;
    });
});
