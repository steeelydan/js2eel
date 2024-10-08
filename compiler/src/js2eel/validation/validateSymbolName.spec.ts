import { expect } from 'chai';
import { validateSymbolName } from './validateSymbolName.js';

describe('validateSymbolName()', () => {
    it('Does not work with a name that is too long', () => {
        const result = validateSymbolName('a'.repeat(128));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0]).to.contain('127');
    });
});
