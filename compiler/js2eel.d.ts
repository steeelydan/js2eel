/// <reference no-default-lib="true"/>

// CONFIGURATION

/**
 * Configures the plugin.
 *
 * @example ```javascript
 * config({ description: 'volume', inChannels: 2, outChannels: 2 });
 * ```
 */
declare function config({
    description,
    inChannels,
    outChannels,
    extTailSize
}: {
    description: number;
    inChannels: number;
    outChannels: number;
    extTailSize?: number;
}): void;

/**
 * Registers a slider and its bound variable to be displayed in the plugin.
 *
 * @example ```javascript
 * slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');
 * ```
 */
declare function slider(
    sliderNumber: number,
    variable: number,
    initialValue: number,
    min: number,
    max: number,
    step: number,
    label: string
): void;

/**
 * Registers a select box and its bound variable to be displayed in the plugin.
 *
 * @example ```javascript
 * selectBox(
 *     3,
 *     algorithm,
 *     'sigmoid',
 *     [
 *         { name: 'sigmoid', label: 'Sigmoid' },
 *         { name: 'htan', label: 'Hyperbolic Tangent' },
 *         { name: 'hclip', label: 'Hard Clip' }
 *     ],
 *     'Algorithm'
 * );
 * ```
 */
declare function selectBox(
    sliderNumber: number,
    variable: string,
    initialValue: string,
    values: { name: string; label: string }[],
    label: string
): void;

/**
 * Registers a file selector to be displayed in the plugin.
 *
 * The path is relative to <REAPER_DIR>/data.
 *
 * @example ```javascript
 * fileSelector(
 *     5,
 *     ampModel,
 *     'amp_models',
 *     'none',
 *     'Impulse Response'
 * );
 * ```
 */
declare function fileSelector(
    sliderNumber: number,
    variable: string,
    path: string,
    defaultValue: string,
    label: string
): void;

// DEBUGGING

/**
 * JS2EEL only supports the `.log()` method.
 * `console.log()` creates a debug variable to print the value of a variable in the JSFX dev environment.
 *
 * @example ```javascript
 * let myVal = 3;
 * console.log(myVal);
 * ```
 */
declare const console: {
    log: (someVar: number | string) => void;
};

// JSFX COMPUTATION STAGES

/**
 * Init variables and functions here.
 */
declare function onInit(callback: () => void): void;

/**
 * What happens when a slider is moved.
 */
declare function onSlider(callback: () => void): void;

/**
 * Called for every audio block.
 */
declare function onBlock(callback: () => void): void;

/**
 * Called for every single sample.
 */
declare function onSample(callback: () => void): void;

/**
 * Iterates over each channel and provides the current sample for manipulation.
 */
declare function eachChannel(callback: (sample: number, channel: number) => void): void;

// DATA STRUCTURES

/**
 * A fixed-size, multi-dimensional container for audio samples.
 *
 * Access: `buf[dimension][position]`
 *
 * Translates to EEL2s memory objects. Is not inlined in the EEL source, so
 * only feasible for large data. For small data, use EelArray.
 */
declare class EelBuffer {
    constructor(dimensions: number, size: number);

    dimensions(): number;
    size(): number;
    start(): number;
}

/**
 * A fixed-size, multi-dimensional container for numeric data.
 *
 * Access: `arr[dimension][position]`
 *
 * Is inlined in the EEL source, dimensions and size are restricted to 16 each. For large data,
 * use EelBuffer.
 */
declare class EelArray {
    constructor(dimensions: number, size: number);

    dimensions(): number;
    size(): number;
}

// AUDIO CONSTANTS

/** The sample rate of your project */
declare const srate: number;

/** Number of channels available */
declare const num_ch: number;

/** How many samples will come before the next `onBlock()` call */
declare const samplesblock: number;

/** The tempo of your project */
declare const tempo: number;

/** The current playback state of REAPER (0=stopped, <0=error, 1=playing, 2=paused, 5=recording, 6=record paused) */
declare const play_state: number;

/** The current playback position in REAPER (as of last @block), in seconds */
declare const play_position: number;

/** Read-only. The current playback position (as of last @block) in REAPER, in beats (beats = quarternotes in /4 time signatures).  */
declare const beat_position: number;

/** Read-only. The current time signature numerator, i.e. 3.0 if using 3/4 time.  */
declare const ts_num: number;

/** Read-only. The current time signature denominator, i.e. 4.0 if using 3/4 time. */
declare const ts_denom: number;

/** Channel 1 (L) sample variable */
declare const spl0: number;
/** Channel 2 (R) sample variable */
declare const spl1: number;
/** Channel 3 sample variable */
declare const spl2: number;
/** Channel 4 sample variable */
declare const spl3: number;
/** Channel 5 sample variable */
declare const spl4: number;
/** Channel 6 sample variable */
declare const spl5: number;
/** Channel 7 sample variable */
declare const spl6: number;
/** Channel 8 sample variable */
declare const spl7: number;
/** Channel 9 sample variable */
declare const spl8: number;
/** Channel 10 sample variable */
declare const spl9: number;
/** Channel 11 sample variable */
declare const spl10: number;
/** Channel 12 sample variable */
declare const spl11: number;
/** Channel 13 sample variable */
declare const spl12: number;
/** Channel 14 sample variable */
declare const spl13: number;
/** Channel 15 sample variable */
declare const spl14: number;
/** Channel 16 sample variable */
declare const spl15: number;
/** Channel 17 sample variable */
declare const spl16: number;
/** Channel 18 sample variable */
declare const spl17: number;
/** Channel 19 sample variable */
declare const spl18: number;
/** Channel 20 sample variable */
declare const spl19: number;
/** Channel 21 sample variable */
declare const spl20: number;
/** Channel 22 sample variable */
declare const spl21: number;
/** Channel 23 sample variable */
declare const spl22: number;
/** Channel 24 sample variable */
declare const spl23: number;
/** Channel 25 sample variable */
declare const spl24: number;
/** Channel 26 sample variable */
declare const spl25: number;
/** Channel 27 sample variable */
declare const spl26: number;
/** Channel 28 sample variable */
declare const spl27: number;
/** Channel 29 sample variable */
declare const spl28: number;
/** Channel 30 sample variable */
declare const spl29: number;
/** Channel 31 sample variable */
declare const spl30: number;
/** Channel 32 sample variable */
declare const spl31: number;
/** Channel 33 sample variable */
declare const spl32: number;
/** Channel 34 sample variable */
declare const spl33: number;
/** Channel 35 sample variable */
declare const spl34: number;
/** Channel 36 sample variable */
declare const spl35: number;
/** Channel 37 sample variable */
declare const spl36: number;
/** Channel 38 sample variable */
declare const spl37: number;
/** Channel 39 sample variable */
declare const spl38: number;
/** Channel 40 sample variable */
declare const spl39: number;
/** Channel 41 sample variable */
declare const spl40: number;
/** Channel 42 sample variable */
declare const spl41: number;
/** Channel 43 sample variable */
declare const spl42: number;
/** Channel 44 sample variable */
declare const spl43: number;
/** Channel 45 sample variable */
declare const spl44: number;
/** Channel 46 sample variable */
declare const spl45: number;
/** Channel 47 sample variable */
declare const spl46: number;
/** Channel 48 sample variable */
declare const spl47: number;
/** Channel 49 sample variable */
declare const spl48: number;
/** Channel 50 sample variable */
declare const spl49: number;
/** Channel 51 sample variable */
declare const spl50: number;
/** Channel 52 sample variable */
declare const spl51: number;
/** Channel 53 sample variable */
declare const spl52: number;
/** Channel 54 sample variable */
declare const spl53: number;
/** Channel 55 sample variable */
declare const spl54: number;
/** Channel 56 sample variable */
declare const spl55: number;
/** Channel 57 sample variable */
declare const spl56: number;
/** Channel 58 sample variable */
declare const spl57: number;
/** Channel 59 sample variable */
declare const spl58: number;
/** Channel 60 sample variable */
declare const spl59: number;
/** Channel 61 sample variable */
declare const spl60: number;
/** Channel 62 sample variable */
declare const spl61: number;
/** Channel 63 sample variable */
declare const spl62: number;
/** Channel 64 sample variable */
declare const spl63: number;

// MATH CONSTANTS

/** Pi */
declare const $pi: number;

// MATH FUNCTIONS

/**
 * Returns the Sine of the angle specified (specified in radians).
 */
declare function sin(angle: number): number;

/**
 * Returns the Cosine of the angle specified (specified in radians).
 */
declare function cos(angle: number): number;

/**
 * Returns the Tangent of the angle specified (specified in radians).
 */
declare function tan(angle: number): number;

/**
 * Returns the Arc Sine of the value specified (return value is in radians).
 */
declare function asin(x: number): number;

/**
 * Returns the Arc Cosine of the value specified (return value is in radians).
 */
declare function acos(x: number): number;

/**
 * Returns the Arc Tangent of the value specified (return value is in radians).
 */
declare function atan(x: number): number;

/**
 * Returns the Arc Tangent of x divided by y (return value is in radians).
 */
declare function atan2(x: number, y: number): number;

/**
 * Returns the square of the parameter (similar to x*x, though only evaluating x once).
 */
declare function sqr(x: number): number;

/**
 * Returns the square root of the parameter.
 */
declare function sqrt(x: number): number;

/**
 * Returns the first parameter raised to the second parameter-th power.
 * Identical in behavior and performance to the ^ operator.
 */
declare function pow(x: number, y: number): number;

/**
 * Returns the number e (approx 2.718) raised to the parameter-th power.
 * This function is significantly faster than pow() or the ^ operator.
 */
declare function exp(x: number): number;

/**
 * Returns the natural logarithm (base e) of the parameter.
 */
declare function log(x: number): number;

/**
 * Returns the logarithm (base 10) of the parameter.
 */
declare function log10(x: number): number;

/**
 * Returns the absolute value of the parameter.
 */
declare function abs(x: number): number;

/**
 * Returns the minimum value of the two parameters.
 */
declare function min(x: number, y: number): number;

/**
 * Returns the maximum value of the two parameters.
 */
declare function max(x: number, y: number): number;

/**
 * Returns the sign of the parameter (-1, 0, or 1).
 */
declare function sign(x: number): number;

/**
 * Returns a pseudo-random number between 0 and the parameter.
 */
declare function rand(x: number): number;

/**
 * Rounds the value to the lowest integer possible (floor(3.9)==3, floor(-3.1)==-4).
 */
declare function floor(x: number): number;

/**
 * Rounds the value to the highest integer possible (ceil(3.1)==4, ceil(-3.9)==-3).
 */
declare function ceil(x: number): number;

/**
 * Returns a fast inverse square root (1/sqrt(x)) approximation of the parameter.
 */
declare function invsqrt(x: number): number;

// MEMORY FUNCTIONS

/**
 *
 */
declare function memset(): void;

// FILE FUNCTIONS

/**
 *Opens a file from a file slider. Once open, you may use all of the file functions available. Be sure to close the file handle when done with it, using file_close(). The search path for finding files depends on the method used, but generally speaking in 4.59+ it will look in the same path as the current effect, then in the JS Data/ directory.
 *
 * @param fileSelector A variable that is bound to the respective file selector. Will be compiled to sliderXY. FIXME types
 */
declare function file_open(fileSelector: any): number;

/**
 *  Closes a file opened with file_open().
 */
declare function file_close(fileHandle: any): void;

/**
 *  Returns the number of items remaining in the file, if it is in read mode. Returns < 0 if in write mode. If the file is in text mode (file_text(handle) returns TRUE), then the return value is simply 0 if EOF, 1 if not EOF.
 */
declare function file_avail(fileSelector: any): number;

/**
 *  If the file was a media file (.wav, .ogg, etc), this will set the first parameter to the number of channels, and the second to the samplerate.

REAPER 6.29+: if the caller sets nch to 'rqsr' and samplerate to a valid samplerate, the file will be resampled to the desired samplerate (this must ONLY be called before any file_var() or file_mem() calls and will change the value returned by file_avail())
 */
declare function file_riff(fileHandle: any, numberOfCh: number, sampleRate: number): void;

/**
 *  Reads (or writes) the block of local memory from(to) the current file. Returns the actual number of items read (or written).
 */
declare function file_mem(fileHandle: any, offset: number, length: number): number;

// FFT & MDCT FUNCTIONS

/**
 *  Performs a FFT (or inverse in the case of ifft()) on the data in the local memory buffer at the offset specified by the first parameter. The size of the FFT is specified by the second parameter, which must be 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, or 32768. The outputs are permuted, so if you plan to use them in-order, call fft_permute(buffer, size) before and fft_ipermute(buffer,size) after your in-order use. Your inputs or outputs will need to be scaled down by 1/size, if used.

Note that the FFT/IFFT require real/imaginary input pairs (so a 256 point FFT actually works with 512 items).

Note that the FFT/IFFT must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.

The fft_real()/ifft_real() variants operate on a set of size real inputs, and produce size/2 complex outputs. The first output pair is DC,nyquist. Normally this is used with fft_permute(buffer,size/2).
 */
declare function fft(startIndex: number, size: number): void;

/**
 *  Performs a FFT (or inverse in the case of ifft()) on the data in the local memory buffer at the offset specified by the first parameter. The size of the FFT is specified by the second parameter, which must be 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, or 32768. The outputs are permuted, so if you plan to use them in-order, call fft_permute(buffer, size) before and fft_ipermute(buffer,size) after your in-order use. Your inputs or outputs will need to be scaled down by 1/size, if used.

Note that the FFT/IFFT require real/imaginary input pairs (so a 256 point FFT actually works with 512 items).

Note that the FFT/IFFT must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.

The fft_real()/ifft_real() variants operate on a set of size real inputs, and produce size/2 complex outputs. The first output pair is DC,nyquist. Normally this is used with fft_permute(buffer,size/2).
 */
declare function ifft(startIndex: number, size: number): void;

/**
 * Used to convolve two buffers, typically after FFTing them. convolve_c works with complex numbers. The sizes specify number of items (the number of complex number pairs).

Note that the convolution must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.
 */
declare function convolve_c(destination: number, source: number, size: number): void;
