import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('literal()', () => {
    it('should compile a true boolean literal as 1', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'accessors', inChannels: 2, outChannels: 2 });

const myVar = true;`
        );

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:accessors

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = 1;


`)
        );
    });

    it('should compile a false boolean literal as 0', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'accessors', inChannels: 2, outChannels: 2 });

const myVar = false;`
        );

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:accessors

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = 0;


`)
        );
    });

    it('wrong literal value', () => {
        const compiler = new Js2EelCompiler();

        const result = compiler.compile(
            `config({ description: 'accessors', inChannels: 2, outChannels: 2 });

const myVar = /^[0-9]$/;`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:accessors

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = ;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
