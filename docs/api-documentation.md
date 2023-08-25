# API Documentation

- [Configuration](#configuration)
- [Debugging](#debugging)
- [JSFX Computation Stages](#jsfx-computation-stages)
- [Data Structures](#data-structures)
- [Audio Constants](#audio-constants)
- [Math Constants](#math-constants)
- [Math Functions](#math-functions)



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
### selectBox()
Registers a select box and its bound variable to be displayed in the plugin.

```typescript
selectBox(
    variable: string,
    initialValue: string,
    values: { name: string; label: string }[],
    label: string
): void;
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
The sample rate of your project.

```typescript
srate: number;
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
