import { expect } from 'chai';
import { getFileNameFromFilePath } from './shared.js';

describe('getFileNameFromPath()', () => {
    it('Extracts correct file name', () => {
        const happyCase = '/home/studio/.config/REAPER/Effects/sd_lowpass_js2eel.jsfx';
        expect(getFileNameFromFilePath(happyCase)).to.equal('sd_lowpass_js2eel.jsfx');

        const weirdSlashes = '///home/studio/.config/REAPER/Effects//sd_lowpass_js2eel.jsfx';
        expect(getFileNameFromFilePath(weirdSlashes)).to.equal('sd_lowpass_js2eel.jsfx');

        const noPath = 'sd_lowpass_js2eel.jsfx';
        expect(getFileNameFromFilePath(noPath)).to.equal('sd_lowpass_js2eel.jsfx');

        const nothing = '';
        expect(getFileNameFromFilePath(nothing)).to.equal('');
    });
});
