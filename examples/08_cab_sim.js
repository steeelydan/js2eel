config({ description: 'sd_amp_sim', inChannels: 2, outChannels: 2 });

fileSelector(1, 'ampModelsSelector', 'amp_models', 'none', 'Impulse Response');

onSample(() => {});
