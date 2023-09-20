import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler';

describe('expressionStatement()', () => {
    it('Error if expression statement node type not allowed', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'expressionStatement', inChannels: 2, outChannels: 2 });

onInit(() => {
    'somestring';
});
`);

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
