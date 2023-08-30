import { describe } from 'mocha';
import { suffixScopeByScopeSuffix } from './suffixScope';
import { expect } from 'chai';

describe('suffixScope()', () => {
    it("doesn't suffix if scope is 0", () => {
        expect(suffixScopeByScopeSuffix('a', 0)).to.equal('a');
    });
});
