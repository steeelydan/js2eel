import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('ifStatement()', () => {
    it('Error if test part is of wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

if ('string') {
    //
}
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


 ? (
);
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Error if consequent part is of wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

if (3 > 4) 3;
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


3 > 4 ? (
);
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Error if alternate part is of wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

if (3 > 4) {
    //
} else spl(0);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


3 > 4 ? (
);
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
