import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../test/helpers.js';

describe('whileStatement()', () => {
    it('does not work with wrong argument type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'while statement', inChannels: 2, outChannels: 2 });

onBlock(() => {
    while (new EelBuffer(2, 100)) {
        //
    }
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL vTO_BE_REPLACED_COMPILER_VERSION */

desc:while statement

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@block

?ä__DENY_COMPILATION

`)
        );
    });

    it('does not work with wrong body type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'while statement', inChannels: 2, outChannels: 2 });

onBlock(() => {
    while (1 > 2) "Nothing"
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.11.0 */

desc:while statement

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@block

?ä__DENY_COMPILATION

`)
        );
    });
});
