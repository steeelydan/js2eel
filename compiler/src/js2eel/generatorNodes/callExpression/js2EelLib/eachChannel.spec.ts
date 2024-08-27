import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../../test/helpers.js';

describe('eachChannel()', () => {
    it("Error if called isn't called in onSample scope", () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

onInit(() => {
    eachChannel((sample, channel) => {
        //
    });
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Error if param is wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel("doesn't make sense");
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('Empty body', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel((sample, channel) => {});
});
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample




`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('Error if callback body is wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel((sample, channel) => 'somestring');
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@sample


/* Channel 0 */

CH__0 = 0;


/* Channel 1 */

CH__1 = 1;




`)
        );
        expect(result.errors.length).to.equal(2); // FIXME Do not check twice
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[1].type).to.equal('TypeError');
    });
});
