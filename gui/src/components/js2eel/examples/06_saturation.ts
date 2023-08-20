export const EXAMPLE_SATURATION_JS = {
    path: 'example://saturation.js',
    src: `config({ description: 'saturation', inChannels: 2, outChannels: 2 });

let gainIn;
let gainInDb;
let volume;
let volumeDb;
let algorithm;

slider(1, gainInDb, 0, 0, 36, 0.01, 'Gain In (dB)');
slider(2, volumeDb, 0, -18, 18, 0.01, 'Volume (dB)');
selectBox(3,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);

onSlider(() => {
    gainIn = Math.pow(10, gainInDb / 20);
    volume = Math.pow(10, volumeDb / 20);
});

onSample(() => {
    eachChannel((sample, _channel) => {
        if (algorithm === 'sigmoid') {
            sample = 2 * (1 / (1 + exp(-gainIn * sample))) - 1;
        } else if (algorithm === 'htan') {
            sample =
                (exp(2 * sample * gainIn) - 1) /
                (exp(2 * sample * gainIn) + 1) /
                ((exp(2 * gainIn) - 1) / (exp(2 * gainIn) + 1));
        } else if (algorithm === 'hclip') {
            sample *= gainIn;
            sample = abs(sample) > 0.5 ? 0.5 * sign(sample) : sample;
        }

        sample *= volume;
    });
});
`
};
