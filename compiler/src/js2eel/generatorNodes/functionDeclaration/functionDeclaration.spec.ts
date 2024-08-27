import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../test/helpers.js';

describe('functionDeclaration()', () => {
    it('Prevents declaration if other symbol with the name, even in other casing, exists', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functionDeclaration', inChannels: 2, outChannels: 2 });

const myConst = 3;

function myconst() {
    //
}`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:functionDeclaration

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myConst = 3;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Error if function name is invalid', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functionDeclaration', inChannels: 2, outChannels: 2 });

function $myFunc() {
    //
}`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:functionDeclaration

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('Error if param is wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'functionDeclaration', inChannels: 2, outChannels: 2 });

function myFunc({name, type}) {
    //
}`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:functionDeclaration

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
