import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../../test/helpers';

describe('evaluateUserFunctionCall()', () => {
    it('error if missing argument', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

function myFunc(someArg) {
    return someArg;
}

onSample(() => {
    const myVar = myFunc();
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample

myVar__S3 = ;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.warnings.length).to.equal(2);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(result.warnings[1].type).to.equal('SymbolUnusedWarning');
    });

    it('error if too many arguments', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

function myFunc(someArg) {
    return someArg;
}

onSample(() => {
    const myVar = myFunc(3, 4);
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample

myVar__S3 = ;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.warnings.length).to.equal(2);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(result.warnings[1].type).to.equal('SymbolUnusedWarning');
    });

    it('error if wrong argument type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

function myFunc(someArg) {
    return someArg;
}

onSample(() => {
    const myVar = myFunc(new EelBuffer(2, 6));
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample

myVar__S3 = ;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.warnings.length).to.equal(2);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(result.warnings[1].type).to.equal('SymbolUnusedWarning');
    });

    it('argument validation fails', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

function myFunc(someArg) {
    return someArg;
}

onSample(() => {
    const myVar = myFunc(/^[0-9]$/);
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample

myVar__S3 = ;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
        expect(result.warnings.length).to.equal(2);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(result.warnings[1].type).to.equal('SymbolUnusedWarning');
    });

    it('works in variableDeclaration with literal', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

function myFunc(someArg) {
    return someArg;
}

onSample(() => {
    const myVar = myFunc(3);
});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample

R__S1__0 = 3;
myVar__S3 = R__S1__0;


`)
        );
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(1);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
    });

    it('works in assignmentExpression with unary expression', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

function myFunc(someArg) {
    return someArg;
}

onSample(() => {
    const myVar = myFunc(-3);
});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample

R__S1__0 = -3;
myVar__S3 = R__S1__0;


`)
        );
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(1);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
    });

    it('works in assignmentExpression with identifier', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

const someVar = 3;

function myFunc(someArg) {
    return someArg;
}

onSample(() => {
    const myVar = myFunc(someVar);
});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

someVar = 3;


@sample

R__S1__0 = someVar;
myVar__S3 = R__S1__0;


`)
        );
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(1);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
    });

    it('member expression as argument', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functions', inChannels: 2, outChannels: 2 });

const myObj = { prop: 1 };
const myVar = floor(myObj.prop);
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:functions

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myObj__prop = 1;


myVar = floor(myObj__prop);
`)
        );
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(1);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
    });
});
