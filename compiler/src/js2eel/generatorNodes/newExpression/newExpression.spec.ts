import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('newExpression()', () => {
    it('Error if called elsewhere than root scope', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'newExpression', inChannels: 2, outChannels: 2 });

onSample(() => {
    const myBuf = new EelBuffer(2, 2);
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:newExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Error if class does not exist', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'newExpression', inChannels: 2, outChannels: 2 });

const myBuf = new GenericBuffer(2, 2);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:newExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
    });
});
