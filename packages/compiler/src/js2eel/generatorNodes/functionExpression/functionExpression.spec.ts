import { expect } from 'chai';
import { describe } from 'mocha';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('functionExpression()', () => {
    it('Wrong param type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'function_expression', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel(([myDesctructuring], channel) => {});
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:function_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample




`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Too few params', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'function_expression', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel((channel) => {});
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:function_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ParameterError');
    });

    it('FunctionExpression can have a name', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'function_expression', inChannels: 2, outChannels: 2 });

onSample(function callback() {});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:function_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(0);
    });
});
