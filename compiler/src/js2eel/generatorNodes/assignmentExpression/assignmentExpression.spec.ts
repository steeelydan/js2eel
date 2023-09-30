import { expect } from 'chai';
import { Js2EelCompiler } from '../../index.js';
import { testEelSrc } from '../../test/helpers.js';

describe('assignmentExpression()', () => {
    it('User defined function: Assigns value to a var via a user function call', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({description: "assignmentExpression", inChannels: 2, outChannels: 2});

let someLeftVar = 10;
let someVar = 20;

function myFunc() {
  return someVar + 1;
}

onSample(() => {
    someLeftVar = myFunc();
});
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someLeftVar = 10;
someVar = 20;


@sample

R__S1__0 = (someVar + 1);
someLeftVar = R__S1__0;


`)
        );
    });

    it('User defined function: Produces an error if left node is of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({description: "assignmentExpression", inChannels: 2, outChannels: 2});

let someLeftVar = 10;
let someVar = 20;

function myFunc() {
  return someVar + 1;
}

onSample(() => {
    "string".length = myFunc();
});
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someLeftVar = 10;
someVar = 20;


@sample

R__S1__0 = (someVar + 1);
 = R__S1__0;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[0].node?.type).to.equal('AssignmentExpression');
    });

    it('User defined function: Error if called symbol is not a function', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'assignmentExpression', inChannels: 2, outChannels: 2 });

const myNonFunc = 3;

let myVar;

myVar = myNonFunc();`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myNonFunc = 3;


myVar = ;
`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Select box: Produces error if right node is not literal', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'wrongbox', inChannels: 2, outChannels: 2 });

let algorithm;
let something = 3;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' }
    ],
    'Algorithm'
);

algorithm = something;
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:wrongbox

slider1:algorithm=0 < 0, 2, 1 {Sigmoid, Hyperbolic Tangent} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

something = 3;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[0].node?.type).to.equal('Identifier');
    });

    it('Select box: Produces error if right node is not string', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'wrongbox', inChannels: 2, outChannels: 2 });

let algorithm;
let something = 3;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' }
    ],
    'Algorithm'
);

algorithm = 1;
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:wrongbox

slider1:algorithm=0 < 0, 2, 1 {Sigmoid, Hyperbolic Tangent} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

something = 3;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[0].node?.type).to.equal('Literal');
    });

    it('Select box: Produces error value is not one of the select box values', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'wrongbox', inChannels: 2, outChannels: 2 });

let algorithm;
let something = 3;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' }
    ],
    'Algorithm'
);

algorithm = 'hardclip';
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:wrongbox

slider1:algorithm=0 < 0, 2, 1 {Sigmoid, Hyperbolic Tangent} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

something = 3;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
        expect(result.errors[0].node?.type).to.equal('Literal');
    });

    it('Select box: Selects correct value from enum if assigned value correct', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'wrongbox', inChannels: 2, outChannels: 2 });

let algorithm;
let something = 3;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' }
    ],
    'Algorithm'
);

algorithm = 'htan';
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:wrongbox

slider1:algorithm=0 < 0, 2, 1 {Sigmoid, Hyperbolic Tangent} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

something = 3;


algorithm = 1`)
        );

        expect(result.errors.length).to.equal(0);
    });

    it('Normal assignment: Produces error if left node is of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({description: "assignmentExpression", inChannels: 2, outChannels: 2});

let someLeftVar = 10;
let someVar = 20;

onSample(() => {
    "someString".length = someVar;
});
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.1 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someLeftVar = 10;
someVar = 20;


@sample

 = someVar;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[0].node?.type).to.equal('AssignmentExpression');
    });

    it('Normal assignment: Produces error if identifier assigned to is const', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({description: "assignmentExpression", inChannels: 2, outChannels: 2});

const someConst = 1;
someConst = 2;`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someConst = 1;


someConst = 2;
`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
        expect(result.errors[0].node?.type).to.equal('Identifier');
    });

    it('Normal assignment: Produces error if identifier assigned to is a param (except "sample"): eachChannel', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'assignmentExpression', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel((sample, channel) => {
        sample = 4;
        channel = 3;
    });
});
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample


/* Channel 0 */

spl0 = 4;
 = 3;

/* Channel 1 */

spl1 = 4;
 = 3;



`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
        expect(result.errors[0].node?.type).to.equal('Identifier');
    });

    it('Normal assignment: Produces error if identifier assigned to is a param (except "sample"): user function', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'assignmentExpression', inChannels: 2, outChannels: 2 });

const func = (someParam) => {
    someParam = someParam + 1;

    return someParam * 2;
};
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
        expect(result.errors[0].node?.type).to.equal('Identifier');
    });

    it('Normal assignment: Produces error if right node is of wrong type', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({description: "assignmentExpression", inChannels: 2, outChannels: 2});

let myVar;

myVar = {};
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:assignmentExpression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


myVar = ;
`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[0].node?.type).to.equal('ObjectExpression');
    });

    it('Normal assignment: Error if unsupported assignment operator', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'sinewave', inChannels: 2, outChannels: 2 });

let someVar = 1;
someVar ^= 2;
`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:sinewave

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someVar = 1;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('OperatorError');
    });
});
