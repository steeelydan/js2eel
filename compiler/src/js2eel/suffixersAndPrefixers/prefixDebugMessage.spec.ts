import { expect } from 'chai';
import { prefixDebugMessage } from './prefixDebugMessage.js';

describe('prefixDebugMessage()', () => {
    it('Prefixes message correctly', () => {
        expect(prefixDebugMessage('debugVar')).to.equal('__debug__debugVar');
    });
});
