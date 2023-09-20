import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';
import { testEelSrc } from '../../test/helpers';

describe('arrayExpression()', () => {
    it('content is objects: No spread expression', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'wrongarray', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { ...someObject },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:wrongarray

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ValidationError');
        expect(result.errors[1].type).to.equal('TypeError');
    });

    it('content is objects: Property key has wrong type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'wrongarray', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(
    1,
    algorithm,
    'htan',
    [
        { 1: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:wrongarray

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ValidationError');
        expect(result.errors[1].type).to.equal('TypeError');
    });

    it('content is objects: Property value has wrong type', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'wrongarray', inChannels: 2, outChannels: 2 });

let algorithm;

let myVar = 'htan';

selectBox(
    1,
    algorithm,
    'htan',
    [
        { name: myVar, label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:wrongarray

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myVar = htan;


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ValidationError');
        expect(result.errors[1].type).to.equal('TypeError');
    });

    it('content is not objects, forbidden', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'wrongarray', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(1, algorithm, 'htan', ['htan', 'sigmoid'], 'Algorithm');
`);

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:wrongarray

slider1:algorithm=-1 < 0, 0, 1 {} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('TypeError');
        expect(result.errors[1].type).to.equal('TypeError');
    });
});
