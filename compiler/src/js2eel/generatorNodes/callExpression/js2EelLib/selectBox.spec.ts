import { describe, it } from 'mocha';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { expect } from 'chai';
import { testEelSrc } from '../../../test/helpers';

describe('selectBox()', () => {
    it('Error if called in non-root scope', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'selectBox', inChannels: 2, outChannels: 2 });

let algorithm;

onInit(() => {
    selectBox(
        1,
        algorithm,
        'sigmoid',
        [
            { name: 'sigmoid', label: 'Sigmoid' },
            { name: 'htan', label: 'Hyperbolic Tangent' },
            { name: 'hclip', label: 'Hard Clip' }
        ],
        'Algorithm'
    );
});
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:selectBox

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('Error if slider number already used', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'selectBox', inChannels: 2, outChannels: 2 });

let algorithm;
let algorithm2;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);

selectBox(
    1,
    algorithm2,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:selectBox

slider1:algorithm=0 < 0, 3, 1 {Sigmoid, Hyperbolic Tangent, Hard Clip} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('EelConventionError');
    });

    it('Error if slider number invalid', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'selectBox', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(
    65,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:selectBox

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ValidationError');
    });

    it('Error if variable already bound to another slider or select box', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'selectBox', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(
    1,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);

selectBox(
    2,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:selectBox

slider1:algorithm=0 < 0, 3, 1 {Sigmoid, Hyperbolic Tangent, Hard Clip} >Algorithm

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BindingError');
    });

    it('Error if initial value not one of the configured values', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'selectBox', inChannels: 2, outChannels: 2 });

let algorithm;

selectBox(
    1,
    algorithm,
    'sigmund',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:selectBox

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ParameterError');
    });
});
