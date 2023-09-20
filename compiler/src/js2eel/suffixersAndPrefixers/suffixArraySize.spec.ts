import { expect } from 'chai';
import { suffixArraySize } from './suffixArraySize';

describe('suffixArraySize()', () => {
    it('Suffixes array size var correctly', () => {
        expect(suffixArraySize('myArray')).to.equal('myArray__size');
    });
});
