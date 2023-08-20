import { expect } from 'chai';
import { Js2EelCompiler } from '../../index.js';
import { testEelSrc } from '../../test/helpers.js';

describe('binaryExpression()', () => {
    it('Generates error if left side type wrong', () => {
        const JS_SRC = `config({description: "teststuff", inChannels: 2, outChannels: 2});

let someVar = new Math() + 1;
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.1 */

desc:teststuff

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someVar = ( + 1);


`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Generates error if right side type wrong', () => {
        const JS_SRC = `config({description: "teststuff", inChannels: 2, outChannels: 2});

let someVar = 15 + new SomeClass();
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.4 */

desc:teststuff

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someVar = (15 + );


`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Right side select box value: Error if wrong node type', () => {
        const JS_SRC = `config({ description: 'binaryExpression', inChannels: 2, outChannels: 2 });

let algorithm;
let myVar = 1;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);

if (algorithm === myVar) {
    //
}
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.24 */

desc:binaryExpression

slider1:algorithm=0 < 0, 3, 1 {Sigmoid, Hyperbolic Tangent, Hard Clip} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = 1;


 ? (
);
`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Right side select box value: Error if not a string', () => {
        const JS_SRC = `config({ description: 'binaryExpression', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);

if (algorithm === 1) {
    //
}
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.24 */

desc:binaryExpression

slider1:algorithm=0 < 0, 3, 1 {Sigmoid, Hyperbolic Tangent, Hard Clip} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


 ? (
);
`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Right side select box value: Error if not valid select box value', () => {
        const JS_SRC = `config({ description: 'binaryExpression', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);

if (algorithm === "sigmund") {
    //
}
`;

        const EEL_EXPECTED = `/* Compiled with JS2EEL v0.0.24 */

desc:binaryExpression

slider1:algorithm=0 < 0, 3, 1 {Sigmoid, Hyperbolic Tangent, Hard Clip} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


 ? (
);
`;

        const compiler = new Js2EelCompiler();
        const result = compiler.compile(JS_SRC);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_EXPECTED));
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
