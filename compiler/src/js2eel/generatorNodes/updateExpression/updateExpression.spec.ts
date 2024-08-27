import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../test/helpers.js';

describe('updateExpression()', () => {
    it('decrements', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'update expression', inChannels: 2, outChannels: 2 });

let number = 1;

onBlock(() => {
    number--;
});
`);

        expect(result.success).to.equal(true);
        expect(result.errors.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED_COMPILER_VERSION */

desc:update expression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

number = 1;


@block

number -= 1;


`)
        );
    });

    it('does not work with wrong type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'update expression', inChannels: 2, outChannels: 2 });

onBlock(() => {
    console.log++;
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED_COMPILER_VERSION */

desc:update expression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@block

?ä__DENY_COMPILATION;


`)
        );
    });
});
