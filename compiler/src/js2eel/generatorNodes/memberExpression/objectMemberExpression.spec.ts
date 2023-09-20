import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('objectMemberExpression()', () => {
    it('Error if callee object not declared', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'object_member_expression', inChannels: 2, outChannels: 2 });

const myVar = not.there();`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:object_member_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


myVar = ;
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
    });

    it('Error if callee object has wrong type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'object_member_expression', inChannels: 2, outChannels: 2 });

const myVar = "somestring".trim();`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:object_member_expression

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


myVar = ;
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
