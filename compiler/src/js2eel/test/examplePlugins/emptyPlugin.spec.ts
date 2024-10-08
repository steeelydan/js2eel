import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

describe('Empty Plugin', () => {
    it('Should make an empty JSFX plugin except description and channels', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'playground', inChannels: 2, outChannels: 2 });`
        );

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.17 */

desc:playground

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );

        expect(result.success).to.equal(true);
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
