import { describe } from 'mocha';
import { Js2EelCompiler } from '../../../compiler/Js2EelCompiler';
import { expect } from 'chai';

describe('onSlider()', () => {
    it('Error if called elsewhere than root scope', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onSlider', inChannels: 2, outChannels: 2 });

onSlider(function callback() {
    onSlider(() => {});
});
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ScopeError');
    });

    it('can only be called once', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onSlider', inChannels: 2, outChannels: 2 });

onSlider(() => {});
onSlider(() => {});
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('StageError');
    });

    it('Error if no callback given', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onSlider', inChannels: 2, outChannels: 2 });

onSlider();
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('ArgumentError');
        expect(result.errors[1].type).to.equal('ArgumentError');
    });

    it('Error if callback has params', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'onSlider', inChannels: 2, outChannels: 2 });

onSlider((sample) => {});
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('ParameterError');
    });

    it('Error if callback body is not a block statement', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'function_expression', inChannels: 2, outChannels: 2 });

onSlider(() => "nope");
`);
        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
