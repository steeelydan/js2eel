config({ description: 'sd_amp_sim', inChannels: 2, outChannels: 2 });

let ampModel;

fileSelector(1, ampModel, 'amp_models', 'none', 'Impulse Response');

onSample(() => {});
