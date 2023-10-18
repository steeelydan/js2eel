import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../helpers.js';

const JS_VOLUME_SRC = fs.readFileSync(path.resolve('../examples/01_volume.js'), 'utf-8');

const EEL_VOLUME_SRC_EXPECTED = `/* Compiled with JS2EEL v0.10.0 */

desc:volume

slider1:volume=0 < -150, 18, 0.1 >Volume [dB]

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

target = 0;


@slider

volume > -149.9 ? (
    target = 10 ^ (volume / (20));
) : (
    target = 0;
);


@sample


/* Channel 0 */

CH__0 = 0;

spl0 *= target;

/* Channel 1 */

CH__1 = 1;

spl1 *= target;



`;

const js2EelCompiler = new Js2EelCompiler();

describe('Example Test: Volume', () => {
    it('Compiles basic volume control', () => {
        const result = js2EelCompiler.compile(JS_VOLUME_SRC);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(testEelSrc(EEL_VOLUME_SRC_EXPECTED));
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(0);
    });
});
