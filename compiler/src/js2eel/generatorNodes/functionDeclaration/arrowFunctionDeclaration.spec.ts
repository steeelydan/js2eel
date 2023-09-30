import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('arrowFunctionDeclaration()', () => {
    it('Error if arrow function body is not a block statement', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'arrowFunction', inChannels: 2, outChannels: 2 });

const myFunction = () => 3;
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:arrowFunction

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('GenericError');
    });

    it('Error if symbol with different casing already declared', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'arrowFunction', inChannels: 2, outChannels: 2 });

const myfunction = 3;
const myFunction = () => {};
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:arrowFunction

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myfunction = 3;


`)
        );

        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('parameters work', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'arrowFunction', inChannels: 2, outChannels: 2 });

const myFunction = (someNum) => {
    return someNum;
};

const myVar = myFunction(3);`);

        expect(result.success).to.equal(true);
        expect(result.errors.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.7.0 */

desc:arrowFunction

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


R__S1__0 = 3;
myVar = R__S1__0;
`)
        );
    });

    it('Error if param is wrong node type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'arrowFunction', inChannels: 2, outChannels: 2 });

const myFunction = ({ name, type }) => {};
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:arrowFunction

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('nested function calls', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'nestedFunctionCalls', inChannels: 2, outChannels: 2 });

const myFunction = () => {
    return 3;
};

const myOtherFunction = () => {
    const intermediate = myFunction();
    return intermediate;
};

const myConst = myOtherFunction();`);

        expect(result.success).to.equal(true);
        expect(result.errors.length).to.equal(0);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:nestedFunctionCalls

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


R__S1__0 = 3;
intermediate__S2 = R__S1__0;
R__S2__0 = intermediate__S2;
myConst = R__S2__0;
`)
        );
    });
});
