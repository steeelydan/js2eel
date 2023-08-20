config({ description: 'volume', inChannels: 2, outChannels: 2 });

let volume = 0;
let target = 0;

slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');

onSlider(() => {
    if (volume > -149.9) {
        target = Math.pow(10, volume / 20);
    } else {
        target = 0;
    }
});

onSample(() => {
    eachChannel((sample, _ch) => {
        sample *= target;
    });
});
