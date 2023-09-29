import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('objectExpression', () => {
    it('whole property of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`config({
    description: 'object_expression',
    inChannels: 2,
    outChannels: 2
});

const someObj = { one: 1 };

const myObj = { ...someObj };
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:object_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someObj__one = 1;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('key of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`config({
    description: 'object_expression',
    inChannels: 2,
    outChannels: 2
});

const myObj = { 0: 1 };
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:object_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('value of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`config({
    description: 'object_expression',
    inChannels: 2,
    outChannels: 2
});

const someObj = { one: 'somestring' };
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:object_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
