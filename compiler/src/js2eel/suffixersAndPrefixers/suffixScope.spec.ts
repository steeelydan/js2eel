import { expect } from 'chai';
import { suffixScopeByScopeSuffix } from './suffixScope';

describe('suffixScope()', () => {
    it("doesn't suffix if scope is 0", () => {
        expect(suffixScopeByScopeSuffix('a', 0)).to.equal('a');
    });
});
