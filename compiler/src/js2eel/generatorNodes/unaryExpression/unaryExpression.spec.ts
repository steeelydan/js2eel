import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('unaryExpression()', () => {
    it('does not evaluate unary expression with wrong argument type', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'test', inChannels: 2, outChannels: 2 });

const myVar2 = -function myFunc() {};
`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

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

    it('allow member expression as unary', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'unaryExpression', inChannels: 2, outChannels: 2 });

let bools = new EelArray(2, 1);
let result = true;

onSample(() => {
    if (!bools[0][0]) {
        result = false;
    } else {
        result = true;
    }
});
`
        );

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:unaryExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

result = 1;


@sample

!bools__D0__0 ? (
    result = 0;
) : (
    result = 1;
);


`)
        );

        expect(result.errors.length).to.equal(0);
    });

    it('allow call expression as unary: Library function', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({
    description: 'unaryExpression',
    inChannels: 2,
    outChannels: 2
});

let gainIn = 1;
let wetL = 1;
let myVar = 0;

myVar = (sign(myVar) * (1 - exp(-abs(gainIn * wetL)))) / (1 - exp(-gainIn));
`
        );

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:unaryExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

gainIn = 1;
wetL = 1;
myVar = 0;


myVar = sign(myVar) * (1 - exp(-abs(gainIn * wetL))) / ((1 - exp(-gainIn)));
`)
        );

        expect(result.errors.length).to.equal(0);
    });

    it('allow call expression as unary: User function', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({
    description: 'unaryExpression',
    inChannels: 2,
    outChannels: 2
});

const myFunc = () => {
    return 3;
};

const myConst = -myFunc();
`
        );

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:unaryExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

R__S1__0 = 3;
myConst = -R__S1__0;


`)
        );

        expect(result.errors.length).to.equal(0);
    });
});
