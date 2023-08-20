import { describe } from 'mocha';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { expect } from 'chai';
import { testEelSrc } from '../../test/helpers';

describe('unaryExpression()', () => {
    it('does not evaluate unary expression with wrong argument type', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'test', inChannels: 2, outChannels: 2 });

const myVar2 = -spl(0);`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:test

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar2 = ;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('error if unsupported unary operator', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'sinewave', inChannels: 2, outChannels: 2 });

let someVar = ~1;
`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:sinewave

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someVar = ;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('OperatorError');
    });
});
