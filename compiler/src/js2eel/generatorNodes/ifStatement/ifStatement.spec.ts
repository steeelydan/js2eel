import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('ifStatement()', () => {
    it('Error if test part is of wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'eachChannel', inChannels: 2, outChannels: 2 });

if ('string') {
    let a = 1;
}
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


?ä__DENY_COMPILATION ? (
    a__S1 = 1;
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
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


3 > 4 ? (
    ?ä__DENY_COMPILATION
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
    let a = 2;
} else spl(0);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:eachChannel

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


3 > 4 ? (
    a__S1 = 2;
) : (
    ?ä__DENY_COMPILATION
);
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('allow unary expression in if statement', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'ifStatement', inChannels: 2, outChannels: 2 });

let bool = false;
let result = true;

onSample(() => {
    if (!bool) {
        result = false;
    } else {
        result = true;
    }
});
`
        );

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:ifStatement

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

bool = 0;
result = 1;


@sample

!bool ? (
    result = 0;
) : (
    result = 1;
);


`)
        );

        expect(result.errors.length).to.equal(0);
    });
});
