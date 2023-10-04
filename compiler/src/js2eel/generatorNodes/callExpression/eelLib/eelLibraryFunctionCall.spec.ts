import { expect } from 'chai';
import { Js2EelCompiler } from '../../../index.js';
import { testEelSrc } from '../../../test/helpers.js';

describe('eelLibraryFunctionCall()', () => {
    it('Evaluates spl() and inlines it with numeric argument', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({description: "libFuncCallTest", inChannels: 2, outChannels: 2});

onSample(() => {
  const myVar = spl(1);
});`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = spl1;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it("Evaluates spl() and DOESN't inline with variable argument", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({description: "libFuncCallTest", inChannels: 2, outChannels: 2});

const splnum = 2;

onSample(() => {
  const myVar = spl(splnum);
});`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

splnum = 2;


@sample

myVar__S2 = spl(splnum);


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it("Evaluates spl() and DOESN't inline in eachChannel", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'libFuncCallTest', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel((sample, channel) => {
        const myVar = spl(channel);
    });
});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample


/* Channel 0 */

myVar__S4 = spl(0);

/* Channel 1 */

myVar__S5 = spl(1);



`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it("Doesn't evaluate spl() with invalid argument", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({description: "libFuncCallTest", inChannels: 2, outChannels: 2});

onSample(() => {
  const myVar = spl("someString");
});`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = ;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    // One argument

    // We only need to test one, because it's one switch case.
    const oneArgumentEelFunctions = ['sin'];

    oneArgumentEelFunctions.forEach((funcName) => {
        it(`Evaluates ${funcName}()`, () => {
            const compiler = new Js2EelCompiler();
            const result =
                compiler.compile(`config({description: "libFuncCallTest", inChannels: 2, outChannels: 2});

onSample(() => {
  const myVar = ${funcName}(1);
});`);
            expect(result.success).to.equal(true);
            expect(testEelSrc(result.src)).to.equal(
                testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = ${funcName}(1);


`)
            );
            expect(result.errors.length).to.equal(0);
        });
    });

    // We only need to test one, because it's one switch case.
    const twoArgumentFunctions = ['pow'];

    twoArgumentFunctions.forEach((funcName) => {
        it(`Evaluates ${funcName}()`, () => {
            const compiler = new Js2EelCompiler();
            const result =
                compiler.compile(`config({description: "libFuncCallTest", inChannels: 2, outChannels: 2});

onSample(() => {
  const myVar = ${funcName}(1, 2);
});`);
            expect(result.success).to.equal(true);
            expect(testEelSrc(result.src)).to.equal(
                testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

myVar__S2 = ${funcName}(1, 2);


`)
            );
            expect(result.errors.length).to.equal(0);
        });
    });

    it('Function call as argument: Library Function', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'libFuncCallTest',
    inChannels: 2,
    outChannels: 2
});

onSample(() => {
    let aNumber = 0;
    aNumber = sqrt(abs(aNumber));
});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

aNumber__S2 = 0;
aNumber__S2 = sqrt(abs(aNumber__S2));


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Function call as argument: User Function', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'libFuncCallTest',
    inChannels: 2,
    outChannels: 2
});

const someFunc = () => {
    return 3;
};

onSample(() => {
    let aNumber = 0;
    aNumber = sqrt(someFunc());
});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:libFuncCallTest

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

aNumber__S3 = 0;
R__S1__0 = 3;
aNumber__S3 = sqrt(R__S1__0);


`)
        );
        expect(result.errors.length).to.equal(0);
    });
});
