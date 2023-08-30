import { describe, it } from 'mocha';
import { prefixDebugMessage } from './prefixDebugMessage.js';
import { expect } from 'chai';

describe('prefixDebugMessage()', () => {
    it('Prefixes message correctly', () => {
        expect(prefixDebugMessage('debugVar')).to.equal('__debug__debugVar');
    });
});
