# API Documentation

- [Configuration](#configuration)
- [Debugging](#debugging)
- [JSFX Computation Stages](#jsfx-computation-stages)
- [Data Structures](#data-structures)
- [Audio Constants](#audio-constants)
- [Math Constants](#math-constants)
- [Math Functions](#math-functions)
- [Memory Functions](#memory-functions)
- [File Functions](#file-functions)
- [FFT & MDCT Functions](#fft-&-mdct-functions)
- [Special Functions & Variables](#special-functions-&-variables)



## Configuration

### config()
Configures the plugin.

```typescript
config({
    description,
    inChannels,
    outChannels
}: {
    description: number;
    inChannels: number;
    outChannels: number;
}): void;
```

Example:
```javascript
config({ description: 'volume', inChannels: 2, outChannels: 2 });
```
### slider()
Registers a slider and its bound variable to be displayed in the plugin.

```typescript
slider(
    sliderNumber: number,
    variable: number,
    initialValue: number,
    min: number,
    max: number,
    step: number,
    label: string
): void;
```

Example:
```javascript
slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');
```
### selectBox()
Registers a select box and its bound variable to be displayed in the plugin.

```typescript
selectBox(
    sliderNumber: number,
    variable: string,
    initialValue: string,
    values: { name: string; label: string }[],
    label: string
): void;
```

Example:
```javascript
selectBox(
    3,
    algorithm,
    'sigmoid',
    [
        { name: 'sigmoid', label: 'Sigmoid' },
        { name: 'htan', label: 'Hyperbolic Tangent' },
        { name: 'hclip', label: 'Hard Clip' }
    ],
    'Algorithm'
);
```
### fileSelector()
Registers a file selector to be displayed in the plugin.

The path is relative to <REAPER_DIR>/data.

```typescript
fileSelector(
    sliderNumber: number,
    variable: string,
    path: string,
    defaultValue: string,
    label: string
): void;
```

Example:
```javascript
fileSelector(
    5,
    ampModel,
    'amp_models',
    'none',
    'Impulse Response'
);
```


## Debugging

### console
JS2EEL only supports the `.log()` method.
`console.log()` creates a debug variable to print the value of a variable in the JSFX dev environment.

```typescript
console: {
    log: (someVar: number | string) => void;
};
```

Example:
```javascript
let myVal = 3;
console.log(myVal);
```


## JSFX Computation Stages

These functions correspond to JSFX's `@sample` etc.

### onInit()
Init variables and functions here.

```typescript
onInit(callback: () => void): void;
```
### onSlider()
What happens when a slider is moved.

```typescript
onSlider(callback: () => void): void;
```
### onBlock()
Called for every audio block.

```typescript
onBlock(callback: () => void): void;
```
### onSample()
Called for every single sample.

```typescript
onSample(callback: () => void): void;
```
### eachChannel()
Iterates over each channel and provides the current sample for manipulation.

```typescript
eachChannel(callback: (sample: number, channel: number) => void): void;
```


## Data Structures

### EelBuffer
A fixed-size, multi-dimensional container for audio samples.

Access: `buf[dimension][position]`

Translates to EEL2s memory objects. Is not inlined in the EEL source, so
only feasible for large data. For small data, use EelArray.

```typescript
EelBuffer {
    constructor(dimensions: number, size: number);

    dimensions(): number;
    size(): number;
    start(): number;
}
```
### EelArray
A fixed-size, multi-dimensional container for numeric data.

Access: `arr[dimension][position]`

Is inlined in the EEL source, dimensions and size are restricted to 16 each. For large data,
use EelBuffer.

```typescript
EelArray {
    constructor(dimensions: number, size: number);

    dimensions(): number;
    size(): number;
}
```


## Audio Constants

### srate
The sample rate of your project

```typescript
srate: number;
```
### num_ch
Number of channels available

```typescript
num_ch: number;
```
### samplesblock
How many samples will come before the next `onBlock()` call

```typescript
samplesblock: number;
```
### tempo
The tempo of your project

```typescript
tempo: number;
```
### play_state
The current playback state of REAPER (0=stopped, <0=error, 1=playing, 2=paused, 5=recording, 6=record paused)

```typescript
play_state: number;
```
### play_position
The current playback position in REAPER (as of last @block), in seconds

```typescript
play_position: number;
```
### beat_position
Read-only. The current playback position (as of last @block) in REAPER, in beats (beats = quarternotes in /4 time signatures).

```typescript
beat_position: number;
```
### ts_num
Read-only. The current time signature numerator, i.e. 3.0 if using 3/4 time.

```typescript
ts_num: number;
```
### ts_denom
Read-only. The current time signature denominator, i.e. 4.0 if using 3/4 time.

```typescript
ts_denom: number;
```
### spl<1-64>
Channel 1 (L) sample variable

```typescript
spl0: number;
```


## Math Constants

### $pi
Pi

```typescript
$pi: number;
```


## Math Functions

These functions correspond exactly to their equivalents in JSFX/EEL2.

### sin()
Returns the Sine of the angle specified (specified in radians).

```typescript
sin(angle: number): number;
```
### cos()
Returns the Cosine of the angle specified (specified in radians).

```typescript
cos(angle: number): number;
```
### tan()
Returns the Tangent of the angle specified (specified in radians).

```typescript
tan(angle: number): number;
```
### asin()
Returns the Arc Sine of the value specified (return value is in radians).

```typescript
asin(x: number): number;
```
### acos()
Returns the Arc Cosine of the value specified (return value is in radians).

```typescript
acos(x: number): number;
```
### atan()
Returns the Arc Tangent of the value specified (return value is in radians).

```typescript
atan(x: number): number;
```
### atan2()
Returns the Arc Tangent of x divided by y (return value is in radians).

```typescript
atan2(x: number, y: number): number;
```
### sqr()
Returns the square of the parameter (similar to x*x, though only evaluating x once).

```typescript
sqr(x: number): number;
```
### sqrt()
Returns the square root of the parameter.

```typescript
sqrt(x: number): number;
```
### pow()
Returns the first parameter raised to the second parameter-th power.
Identical in behavior and performance to the ^ operator.

```typescript
pow(x: number, y: number): number;
```
### exp()
Returns the number e (approx 2.718) raised to the parameter-th power.
This function is significantly faster than pow() or the ^ operator.

```typescript
exp(x: number): number;
```
### log()
Returns the natural logarithm (base e) of the parameter.

```typescript
log(x: number): number;
```
### log10()
Returns the logarithm (base 10) of the parameter.

```typescript
log10(x: number): number;
```
### abs()
Returns the absolute value of the parameter.

```typescript
abs(x: number): number;
```
### min()
Returns the minimum value of the two parameters.

```typescript
min(x: number, y: number): number;
```
### max()
Returns the maximum value of the two parameters.

```typescript
max(x: number, y: number): number;
```
### sign()
Returns the sign of the parameter (-1, 0, or 1).

```typescript
sign(x: number): number;
```
### rand()
Returns a pseudo-random number between 0 and the parameter.

```typescript
rand(x: number): number;
```
### floor()
Rounds the value to the lowest integer possible (floor(3.9)==3, floor(-3.1)==-4).

```typescript
floor(x: number): number;
```
### ceil()
Rounds the value to the highest integer possible (ceil(3.1)==4, ceil(-3.9)==-3).

```typescript
ceil(x: number): number;
```
### invsqrt()
Returns a fast inverse square root (1/sqrt(x)) approximation of the parameter.

```typescript
invsqrt(x: number): number;
```


## Memory Functions

### memset()


```typescript
memset(): void;
```


## File Functions

### file_open()
Opens a file from a file slider. Once open, you may use all of the file functions available. Be sure to close the file handle when done with it, using file_close(). The search path for finding files depends on the method used, but generally speaking in 4.59+ it will look in the same path as the current effect, then in the JS Data/ directory.

@param fileSelector A variable that is bound to the respective file selector. Will be compiled to sliderXY. FIXME types

```typescript
file_open(fileSelector: any): any;
```
### file_close()
Closes a file opened with file_open().

```typescript
file_close(fileHandle: any): void;
```
### file_avail()
Returns the number of items remaining in the file, if it is in read mode. Returns < 0 if in write mode. If the file is in text mode (file_text(handle) returns TRUE), then the return value is simply 0 if EOF, 1 if not EOF.

```typescript
file_avail(fileSelector: any): number;
```
### file_riff()
If the file was a media file (.wav, .ogg, etc), this will set the first parameter to the number of channels, and the second to the samplerate.

REAPER 6.29+: if the caller sets nch to 'rqsr' and samplerate to a valid samplerate, the file will be resampled to the desired samplerate (this must ONLY be called before any file_var() or file_mem() calls and will change the value returned by file_avail())

```typescript
file_riff(fileHandle: any, numberOfCh: number, sampleRate: number): void;
```
### file_mem()
Reads (or writes) the block of local memory from(to) the current file. Returns the actual number of items read (or written).

```typescript
file_mem(fileHandle: any, offset: number, length: number): number;
```


## FFT & MDCT Functions

### fft()
Performs a FFT (or inverse in the case of ifft()) on the data in the local memory buffer at the offset specified by the first parameter. The size of the FFT is specified by the second parameter, which must be 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, or 32768. The outputs are permuted, so if you plan to use them in-order, call fft_permute(buffer, size) before and fft_ipermute(buffer,size) after your in-order use. Your inputs or outputs will need to be scaled down by 1/size, if used.

Note that the FFT/IFFT require real/imaginary input pairs (so a 256 point FFT actually works with 512 items).

Note that the FFT/IFFT must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.

The fft_real()/ifft_real() variants operate on a set of size real inputs, and produce size/2 complex outputs. The first output pair is DC,nyquist. Normally this is used with fft_permute(buffer,size/2).

```typescript
fft(startIndex: number, size: number): void;
```
### ifft()
Performs a FFT (or inverse in the case of ifft()) on the data in the local memory buffer at the offset specified by the first parameter. The size of the FFT is specified by the second parameter, which must be 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, or 32768. The outputs are permuted, so if you plan to use them in-order, call fft_permute(buffer, size) before and fft_ipermute(buffer,size) after your in-order use. Your inputs or outputs will need to be scaled down by 1/size, if used.

Note that the FFT/IFFT require real/imaginary input pairs (so a 256 point FFT actually works with 512 items).

Note that the FFT/IFFT must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.

The fft_real()/ifft_real() variants operate on a set of size real inputs, and produce size/2 complex outputs. The first output pair is DC,nyquist. Normally this is used with fft_permute(buffer,size/2).

```typescript
ifft(startIndex: number, size: number): void;
```
### convolve_c()
Used to convolve two buffers, typically after FFTing them. convolve_c works with complex numbers. The sizes specify number of items (the number of complex number pairs).

Note that the convolution must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.

```typescript
convolve_c(destination: number, source: number, size: number): void;
```


## Special Functions & Variables

### extTailSize()
Set to nonzero if the plug-in produces silence from silence. If positive, specifies length in samples that the plug-in should keep processing after silence (either the output tail length, or the number of samples needed for the plug-in state to settle). If set to -1, REAPER will use automatic output silence detection and let plug-in state settle. If set to -2, then REAPER will assume the plug-in has no tail and no inter-sample state.

```typescript
extTailSize(samples: number): void;
```
