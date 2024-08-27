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
out_pin:Out 0
out_pin:Out 1


@init

fftSize = -1;
needsReFft = 1;
lastAmpModel = -1;
importedBufferChAmount = 0;
interpolationStepCount = 1;
convolutionSource__B0 = 0 * 131072 + 0;
convolutionSource__size = 131072;
importedBuffer__B0 = 0 * 131072 + 131072;
importedBuffer__size = 131072;
lastBlock__B0 = 0 * 65536 + 262144;
lastBlock__size = 65536;
currentBlock__B0 = 0 * 65536 + 327680;
currentBlock__size = 65536;


ext_tail_size = 32768;


@slider

ampModel = slider1;

ampModel !== lastAmpModel ? (
    lastAmpModel = ampModel;
    fileHandle__S5 = file_open(slider1);
    importedBufferSampleRate__S5 = 0;
    fileHandle__S5 > 0 ? (
        file_riff(fileHandle__S5, importedBufferChAmount, importedBufferSampleRate__S5);
        importedBufferChAmount ? (
            importedBufferSize = file_avail(fileHandle__S5) / (importedBufferChAmount);
            needsReFft = 1;
            file_mem(fileHandle__S5, importedBuffer__B0, importedBufferSize * importedBufferChAmount);
        );
        file_close(fileHandle__S5);
    );
);


@block

needsReFft ? (
    importedBufferSize > 16384 ? (
        importedBufferSize = 16384;
    );
    fftSize = 32;
    while (importedBufferSize > fftSize * 0.5) (
        fftSize += fftSize;
    );
    chunkSize = ((fftSize - importedBufferSize) - 1);
    chunkSize2x = chunkSize * 2;
    bufferPosition = 0;
    inverseFftSize = 1 / (fftSize);
    i__S10 = 0;
    i2__S10 = 0;
    interpolationCounter__S10 = 0;
    while (interpolationCounter__S10 < min(fftSize, importedBufferSize)) (
        ipos__S13 = i__S10;
        ipart__S13 = (i__S10 - ipos__S13);
        convolutionSource__B0[i2__S10] = (importedBuffer__B0[ipos__S13 * importedBufferChAmount] * (1 - ipart__S13) + importedBuffer__B0[((ipos__S13 + 1) * importedBufferChAmount - 1)] * ipart__S13);
        convolutionSource__B0[(i2__S10 + 1)] = (importedBuffer__B0[(ipos__S13 * importedBufferChAmount - 1)] * (1 - ipart__S13) + importedBuffer__B0[((ipos__S13 + 2) * importedBufferChAmount - 1)] * ipart__S13);
        i__S10 += interpolationStepCount;
        i2__S10 += 2;
        interpolationCounter__S10 += 1;
    );
    zeroPadCounter__S10 = 0;
    while (zeroPadCounter__S10 < (fftSize - importedBufferSize)) (
        convolutionSource__B0[i2__S10] = 0;
        convolutionSource__B0[(i2__S10 + 1)] = 0;
        i2__S10 += 2;
        zeroPadCounter__S10 += 1;
    );
    fft(convolutionSource__B0, fftSize);
    i__S10 = 0;
    normalizeCounter__S10 = 0;
    while (normalizeCounter__S10 < fftSize * 2) (
        convolutionSource__B0[i__S10] *= inverseFftSize;
        i__S10 += 1;
        normalizeCounter__S10 += 1;
    );
    needsReFft = 0;
);


@sample

importedBufferSize > 0 ? (
    bufferPosition >= chunkSize ? (
        __TEMP_BUFFER_SWAP__0 = lastBlock__B0;
        lastBlock__B0 = currentBlock__B0;
        currentBlock__B0 = __TEMP_BUFFER_SWAP__0;
        memset((currentBlock__B0 + chunkSize * 2), 0, (fftSize - chunkSize) * 2);
        fft(currentBlock__B0, fftSize);
        convolve_c(currentBlock__B0, convolutionSource__B0, fftSize);
        ifft(currentBlock__B0, fftSize);
        bufferPosition = 0;
    );
    bufferPosition2x__S18 = bufferPosition * 2;
    lastBlock__B0[bufferPosition2x__S18] = spl0;
    lastBlock__B0[(bufferPosition2x__S18 + 1)] = 0;
    spl0 = currentBlock__B0[bufferPosition2x__S18];
    spl1 = currentBlock__B0[(bufferPosition2x__S18 + 1)];
    bufferPosition < (fftSize - chunkSize) ? (
        spl0 += lastBlock__B0[(chunkSize2x + bufferPosition2x__S18)];
        spl1 += lastBlock__B0[((chunkSize2x + bufferPosition2x__S18) + 1)];
    );
    bufferPosition += 1;
);


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
