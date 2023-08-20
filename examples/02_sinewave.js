config({ description: 'sinewave', inChannels: 2, outChannels: 2 });

let freq;
let voldb;
let vol;
let t;

slider(1, freq, 80, 0, 440, 1, 'Frequency [Hz]');
slider(2, voldb, -9, -72, 0, 0.1, 'Volume [dB]');

onSlider(() => {
    vol = 10 ** (voldb / 20);
});

onSample(() => {
    eachChannel((sample, _ch) => {
        sample = sin(2 * $pi * freq * t) * vol;
    });

    t += 1 / srate;
});
