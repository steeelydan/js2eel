import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_CAB_SIM_SRC = fs.readFileSync(path.resolve('../examples/08_cab_sim.js'), 'utf-8');

const EEL_CAB_SIM_SRC_EXPECTED = `/* Compiled with JS2EEL v0.10.0 */

desc:sd_amp_sim

slider1:/amp_models:none:Impulse Response

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: Cab Sim', () => {
    it('Compiles cab sim', () => {
        const result = js2EelCompiler.compile(JS_CAB_SIM_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_CAB_SIM_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
