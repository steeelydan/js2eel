config({ description: 'sd_amp_sim', inChannels: 2, outChannels: 2, extTailSize: 32768 });

let fftSize = -1;
let needsReFft = true;
let convolutionSource = new EelBuffer(1, 131072); // 128 * 1024;
let lastAmpModel = -1;
let importedBuffer = new EelBuffer(1, 131072); // 128 * 1024;
let importedBufferChAmount = 0;
let importedBufferSize;
let chunkSize;
let chunkSize2x;
let bufferPosition;
let lastBlock = new EelBuffer(1, 65536); // 64 * 1024
let currentBlock = new EelBuffer(1, 65536); // 64 * 1024
let inverseFftSize;
const interpolationStepCount = 1.0;

let ampModel;

fileSelector(1, ampModel, 'amp_models', 'none', 'Impulse Response');

onSlider(() => {
    if (ampModel !== lastAmpModel) {
        lastAmpModel = ampModel;

        const fileHandle = file_open(ampModel);

        let importedBufferSampleRate = 0;

        if (fileHandle > 0) {
            file_riff(fileHandle, importedBufferChAmount, importedBufferSampleRate);

            if (importedBufferChAmount) {
                importedBufferSize = file_avail(fileHandle) / importedBufferChAmount;

                needsReFft = true;

                // FIXME multi dim buffer?
                file_mem(
                    fileHandle,
                    importedBuffer.start(),
                    importedBufferSize * importedBufferChAmount
                );
            }

            file_close(fileHandle);
        }
    }
});

onBlock(() => {
    if (needsReFft) {
        if (importedBufferSize > 16384) {
            importedBufferSize = 16384;
        }

        fftSize = 32;

        while (importedBufferSize > fftSize * 0.5) {
            fftSize += fftSize;
        }

        chunkSize = fftSize - importedBufferSize - 1;
        chunkSize2x = chunkSize * 2;
        bufferPosition = 0;

        inverseFftSize = 1 / fftSize;

        let i = 0;
        let i2 = 0;

        let interpolationCounter = 0;

        while (interpolationCounter < min(fftSize, importedBufferSize)) {
            const ipos = i;
            const ipart = i - ipos;

            convolutionSource[0][i2] =
                importedBuffer[0][ipos * importedBufferChAmount] * (1 - ipart) +
                importedBuffer[0][(ipos + 1) * importedBufferChAmount - 1] * ipart;

            convolutionSource[0][i2 + 1] =
                importedBuffer[0][ipos * importedBufferChAmount - 1] * (1 - ipart) +
                importedBuffer[0][(ipos + 2) * importedBufferChAmount - 1] * ipart;

            i += interpolationStepCount;
            i2 += 2;

            interpolationCounter++;
        }

        let zeroPadCounter = 0;

        while (zeroPadCounter < fftSize - importedBufferSize) {
            convolutionSource[0][i2] = 0;
            convolutionSource[0][i2 + 1] = 0;
            i2 += 2;

            zeroPadCounter++;
        }

        fft(convolutionSource.start(), fftSize);

        i = 0;

        let normalizeCounter = 0;

        while (normalizeCounter < fftSize * 2) {
            convolutionSource[0][i] *= inverseFftSize;
            i += 1;

            normalizeCounter++;
        }

        needsReFft = false;
    }
});

onSample(() => {
    if (importedBufferSize > 0) {
        if (bufferPosition >= chunkSize) {
            lastBlock.swap(currentBlock);

            memset(currentBlock.start() + chunkSize * 2, 0, (fftSize - chunkSize) * 2);

            // Perform FFT on currentBlock, convolve, and perform inverse FFT
            fft(currentBlock.start(), fftSize);
            convolve_c(currentBlock.start(), convolutionSource.start(), fftSize);
            ifft(currentBlock.start(), fftSize);

            bufferPosition = 0;
        }

        // Save sample
        const bufferPosition2x = bufferPosition * 2;

        lastBlock[0][bufferPosition2x] = spl0;
        lastBlock[0][bufferPosition2x + 1] = 0;

        spl0 = currentBlock[0][bufferPosition2x];
        spl1 = currentBlock[0][bufferPosition2x + 1];

        // Apply overlap-and-add for block continuity
        if (bufferPosition < fftSize - chunkSize) {
            spl0 += lastBlock[0][chunkSize2x + bufferPosition2x];
            spl1 += lastBlock[0][chunkSize2x + bufferPosition2x + 1];
        }

        bufferPosition += 1;
    }
});
