import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('memberExpressionStatic', () => {
    it('object not found', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`config({
    description: 'member_expression_static',
    inChannels: 2,
    outChannels: 2
});

const myVar = myObj.prop;
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:member_expression_static

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


myVar = ;
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
    });

    it('object is no object', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`config({
    description: 'member_expression_static',
    inChannels: 2,
    outChannels: 2
});

const myFakeObj = 13;

const myVar = myFakeObj.prop;
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:member_expression_static

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myFakeObj = 13;


myVar = ;
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('property does not exist', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`config({
    description: 'member_expression_static',
    inChannels: 2,
    outChannels: 2
});

const myObj = { one: 1 };

const myVar = myObj.two;`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:member_expression_static

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myObj__one = 1;


myVar = ;
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
    });

    it('object not in root scope', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(`config({
    description: 'member_expression_static',
    inChannels: 2,
    outChannels: 2
});

onSample(() => {
    const myObj = { one: 1 };

    const myVar = myObj.one;
});
`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:member_expression_static

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myObj__one__S2 = 1;
myVar__S2 = myObj__one__S2;


`)
        );
        expect(result.errors.length).to.equal(0);
    });
});
