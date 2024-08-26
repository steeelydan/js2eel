import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../../test/helpers';

describe('console()', () => {
    it('Creates a debug variable if we console.log', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const myVar = 3;
console.log(myVar);`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myVar = 3;


__debug__myVar = myVar;
`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it("Doesn't do plain values", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const myVar = 3;
console.log("aString");`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myVar = 3;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it("Doesn't do stuff other than log()", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

const myVar = 3;
console.error(myVar);`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.15 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

myVar = 3;


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('IllegalPropertyError');
    });

    it("Error if trying to print var that doesn't exist", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'volume', inChannels: 2, outChannels: 2 });

console.log(myVar);`);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:volume

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
        expect(result.errors[1].type).to.equal('UnknownSymbolError');
    });
});
