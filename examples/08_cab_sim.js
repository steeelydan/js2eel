config({ description: 'cab_sim', inChannels: 2, outChannels: 2 });

let fftSize = -1;
let needsReFft = true;
let convolutionSource = new EelBuffer(1, 131072); // 128 * 1024;
let lastAmpModel = -1;
let importedBuffer = new EelBuffer(1, 131072); // 256 * 1024;
let importedBufferChAmount = 0;
let importedBufferSize;
let chunkSize;
let chunkSize2x;
let bufferPosition;
let currentBlock;
let lastBlock = new EelBuffer(1, 65536); // 64 * 1024
let inverseFftSize;
const interpolationStepCount = 1.0;

let ampModel;

fileSelector(1, ampModel, 'amp_models', 'none', 'Impulse Response');

onInit(() => {
    extTailSize(32768);
});

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
        currentBlock = 0;

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
        }

        fft(convolutionSource.start(), fftSize);

        i = 0;

        let normalizeCounter = 0;

        while (normalizeCounter < fftSize * 2) {
            convolutionSource[0][i] *= inverseFftSize;
            i += 1;
        }

        needsReFft = false;
    }
});

onSample(() => {
    if (importedBufferSize > 0) {
        if (bufferPosition >= chunkSize) {
            const t = lastBlock;
            lastBlock = currentBlock;
            currentBlock = t;

            memset(currentBlock * chunkSize * 2, 0, (fftSize - chunkSize) * 2);

            fft(currentBlock, fftSize);
            convolve_c(currentBlock, convolutionSource.start(), fftSize);
            ifft(currentBlock, fftSize);

            bufferPosition = 0;
        }

        const bufferPosition2x = bufferPosition * 2;
        lastBlock[bufferPosition2x] = spl0;
    }
});
