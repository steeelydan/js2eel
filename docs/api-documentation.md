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

Signature:
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
TODO
```
### slider()
Registers a slider and its bound variable to be displayed in the plugin.

Signature:
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
TODO
```
### selectBox()
Registers a select box and its bound variable to be displayed in the plugin.

Signature:
```typescript
selectBox(
    variable: string,
    initialValue: string,
    values: { name: string; label: string }[],
    label: string
): void;
```

Example:
```javascript
TODO
```


## Debugging

### console
JS2EEL only supports the `.log()` method.
`console.log()` creates a debug variable to print the value of a variable in the JSFX dev environment.

Signature:
```typescript
console: {
    log: (someVar: number | string) => void;
};
```

Example:
```javascript
TODO
```


## JSFX Computation Stages

These functions correspond to JSFX's `@sample` etc.

### onInit()
Init variables and functions here.

Signature:
```typescript
onInit(callback: () => void): void;
```

Example:
```javascript
TODO
```
### onSlider()
What happens when a slider is moved.

Signature:
```typescript
onSlider(callback: () => void): void;
```

Example:
```javascript
TODO
```
### onSample()
Called for every single sample.

Signature:
```typescript
onSample(callback: () => void): void;
```

Example:
```javascript
TODO
```
### eachChannel()
Iterates over each channel and provides the current sample for manipulation.

Signature:
```typescript
eachChannel(callback: (sample: number, channel: number) => void): void;
```

Example:
```javascript
TODO
```


## Data Structures

### EelBuffer
A fixed-size, multi-dimensional container for audio samples.

Access: `buf[dimension][position]`

Translates to EEL2s memory objects. Is not inlined in the EEL source, so
only feasible for large data. For small data, use EelArray.

Signature:
```typescript
EelBuffer {
    constructor(dimensions: number, size: number);

    dimensions(): number;
    size(): number;
}
```

Example:
```javascript
TODO
```
### EelArray
A fixed-size, multi-dimensional container for numeric data.

Access: `arr[dimension][position]`

Is inlined in the EEL source, dimensions and size are restricted to 16 each. For large data,
use EelBuffer.

Signature:
```typescript
EelArray {
    constructor(dimensions: number, size: number);

    dimensions(): number;
    size(): number;
}
```

Example:
```javascript
TODO
```


## Audio Constants

### srate
The sample rate of your project.

Signature:
```typescript
srate: number;
```

Example:
```javascript
TODO
```
### spl<1-64>
Channel 1 (L) sample variable

Signature:
```typescript
spl0: number;
```

Example:
```javascript
TODO
```


## Math Constants

### $pi
Pi

Signature:
```typescript
$pi: number;
```

Example:
```javascript
TODO
```


## Math Functions

These functions correspond exactly to their equivalents in JSFX/EEL2.

### sin()
Returns the Sine of the angle specified (specified in radians).

Signature:
```typescript
sin(angle: number): number;
```

Example:
```javascript
TODO
```
### cos()
Returns the Cosine of the angle specified (specified in radians).

Signature:
```typescript
cos(angle: number): number;
```

Example:
```javascript
TODO
```
### tan()
Returns the Tangent of the angle specified (specified in radians).

Signature:
```typescript
tan(angle: number): number;
```

Example:
```javascript
TODO
```
### asin()
Returns the Arc Sine of the value specified (return value is in radians).

Signature:
```typescript
asin(x: number): number;
```

Example:
```javascript
TODO
```
### acos()
Returns the Arc Cosine of the value specified (return value is in radians).

Signature:
```typescript
acos(x: number): number;
```

Example:
```javascript
TODO
```
### atan()
Returns the Arc Tangent of the value specified (return value is in radians).

Signature:
```typescript
atan(x: number): number;
```

Example:
```javascript
TODO
```
### atan2()
Returns the Arc Tangent of x divided by y (return value is in radians).

Signature:
```typescript
atan2(x: number, y: number): number;
```

Example:
```javascript
TODO
```
### sqr()
Returns the square of the parameter (similar to x*x, though only evaluating x once).

Signature:
```typescript
sqr(x: number): number;
```

Example:
```javascript
TODO
```
### sqrt()
Returns the square root of the parameter.

Signature:
```typescript
sqrt(x: number): number;
```

Example:
```javascript
TODO
```
### pow()
Returns the first parameter raised to the second parameter-th power.
Identical in behavior and performance to the ^ operator.

Signature:
```typescript
pow(x: number, y: number): number;
```

Example:
```javascript
TODO
```
### exp()
Returns the number e (approx 2.718) raised to the parameter-th power.
This function is significantly faster than pow() or the ^ operator.

Signature:
```typescript
exp(x: number): number;
```

Example:
```javascript
TODO
```
### log()
Returns the natural logarithm (base e) of the parameter.

Signature:
```typescript
log(x: number): number;
```

Example:
```javascript
TODO
```
### log10()
Returns the logarithm (base 10) of the parameter.

Signature:
```typescript
log10(x: number): number;
```

Example:
```javascript
TODO
```
### abs()
Returns the absolute value of the parameter.

Signature:
```typescript
abs(x: number): number;
```

Example:
```javascript
TODO
```
### min()
Returns the minimum value of the two parameters.

Signature:
```typescript
min(x: number, y: number): number;
```

Example:
```javascript
TODO
```
### max()
Returns the maximum value of the two parameters.

Signature:
```typescript
max(x: number, y: number): number;
```

Example:
```javascript
TODO
```
### sign()
Returns the sign of the parameter (-1, 0, or 1).

Signature:
```typescript
sign(x: number): number;
```

Example:
```javascript
TODO
```
### rand()
Returns a pseudo-random number between 0 and the parameter.

Signature:
```typescript
rand(x: number): number;
```

Example:
```javascript
TODO
```
### floor()
Rounds the value to the lowest integer possible (floor(3.9)==3, floor(-3.1)==-4).

Signature:
```typescript
floor(x: number): number;
```

Example:
```javascript
TODO
```
### ceil()
Rounds the value to the highest integer possible (ceil(3.1)==4, ceil(-3.9)==-3).

Signature:
```typescript
ceil(x: number): number;
```

Example:
```javascript
TODO
```
### invsqrt()
Returns a fast inverse square root (1/sqrt(x)) approximation of the parameter.

Signature:
```typescript
invsqrt(x: number): number;
```

Example:
```javascript
TODO
```
