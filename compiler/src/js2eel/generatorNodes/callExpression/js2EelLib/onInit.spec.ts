import { expect } from 'chai';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler.js';

describe('onInit()', () => {
    it('Error if called elsewhere than root scope', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onInit', inChannels: 2, outChannels: 2 });

onSample(function callback() {
    onInit(() => {});
});
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('can only be called once', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onInit', inChannels: 2, outChannels: 2 });

onInit(() => {});
onInit(() => {});
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('StageError');
    });

    it('Error if no callback given', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onInit', inChannels: 2, outChannels: 2 });

onInit();
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.errors[1].type).to.equal('ArgumentError');
    });

    it('Error if callback has args', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onInit', inChannels: 2, outChannels: 2 });

onInit((sample) => {});
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ParameterError');
    });

    it('Error if callback body is not a block statement', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'function_expression', inChannels: 2, outChannels: 2 });

onInit(() => "nope");
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
