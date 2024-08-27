import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../test/helpers.js';

describe('variableDeclaration()', () => {
    it('Gives an error if "var" declaration', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

var myVar = 3;
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('KeywordError');
    });

    it('Gives an error if symbol name is reserved name', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'variableDeclaration', inChannels: 2, outChannels: 2 });

const abs = abs(sample);
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:variableDeclaration

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('SymbolAlreadyDeclaredError');
    });

    it('Gives an error if more than 1 declaration per line', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const myVar = 3, mySecondVar = 3;
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
    });

    it('Gives an error if EEL reserved name is used', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const srate = 3;
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Gives an error if variable already declared', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const someVar = 3;
const someVar = 3;
`);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(``));
        expect(result.errors.length).to.equal(0);
        expect(
            (result.parserError + '').indexOf(
                "SyntaxError: Identifier 'someVar' has already been declared "
            )
        ).to.equal(0);
    });

    it('Gives an error if name is not legal', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const $someVar = 3;
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

$someVar = 3;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('Gives an error if left side is no identifier', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const { someStuff } = 3;
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Gives an error if right side is wrong type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const myArr = [];
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


myArr = ;
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Gives an error if there is a differently cased variable with the same name in the same scope (EEL is case-insensitive)', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'sAmEnAmE', inChannels: 2, outChannels: 2 });

const arr = new EelArray(2, 3);
const Arr = 3;`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:sAmEnAmE

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Compiles const declaration on root level and moves it up to init stage', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const someVar = 3;
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

someVar = 3;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Compiles let declaration on root level and moves it up to init stage', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

let someVar = 4;
`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

someVar = 4;


`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Right side can be conditional expression (ternary)', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'variableDeclaration', inChannels: 2, outChannels: 2 });

let someVar = 4 < 5 ? 1 : 2;
    `);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.9.1 */

desc:variableDeclaration

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


someVar = 4 < 5 ? 1 : 2;
`)
        );
        expect(result.errors.length).to.equal(0);
    });

    // ... other happy cases are covered in the example tests
});
