import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../../test/helpers';

it('Error if member function does not exist', () => {
    const compiler = new Js2EelCompiler();

    const result =
        compiler.compile(`config({ description: 'arraymembers', inChannels: 2, outChannels: 2 });

const arr = new EelArray(2, 3);
const dim = arr.dim();`);

    expect(result.success).to.equal(false);
    expect(testEelSrc(result.src)).to.equal(
        testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:arraymembers

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


dim = ;
`)
    );
    expect(result.errors.length).to.equal(1);
    expect(result.errors[0].type).to.equal('UnknownSymbolError');
});

describe('eelArrayMemberCall()', () => {
    it('calls array member functions correctly', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'arraymembers', inChannels: 2, outChannels: 2 });

const arr = new EelArray(2, 3);
const dim = arr.dimensions();
const size = arr.size();`);

        expect(result.success).to.equal(true);
        expect(result.errors.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.22 */

desc:arraymembers

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


dim = 2;
size = 3;
`)
        );
    });
});
