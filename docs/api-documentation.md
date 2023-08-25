# API Documentation

## Configuration

### config()

Configures the plugin.

```javascript
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
### slider()

Registers a slider and its bound variable to be displayed in the plugin.

```javascript
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

```javascript
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

```javascript
console: {
    log: (someVar: number | string) => void;
};
```


## JSFX Computation Stages

These functions correspond to JSFX's `@sample` etc.

### onInit()

Init variables and functions here.

```javascript
onInit(callback: () => void): void;
```
### onSlider()

What happens when a slider is moved.

```javascript
onSlider(callback: () => void): void;
```
### onSample()

Called for every single sample.

```javascript
onSample(callback: () => void): void;
```
### eachChannel()

Iterates over each channel and provides the current sample for manipulation.

```javascript
eachChannel(callback: (sample: number, channel: number) => void): void;
```


## Data Structures

### EelBuffer

A fixed-size, multi-dimensional container for audio samples.

Access: `buf[dimension][position]`

Translates to EEL2s memory objects. Is not inlined in the EEL source, so
only feasible for large data. For small data, use EelArray.

```javascript
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

```javascript
EelArray {
    constructor(dimensions: number, size: number);

    dimensions(): number;
    size(): number;
}
```


## Math Functions

These functions correspond exactly to their equivalents in JSFX/EEL2.

### sin()

Returns the Sine of the angle specified (specified in radians).

```javascript
sin(angle: number): number;
```
### cos()

Returns the Cosine of the angle specified (specified in radians).

```javascript
cos(angle: number): number;
```
### tan()

Returns the Tangent of the angle specified (specified in radians).

```javascript
tan(angle: number): number;
```
### asin()

Returns the Arc Sine of the value specified (return value is in radians).

```javascript
asin(x: number): number;
```
### acos()

Returns the Arc Cosine of the value specified (return value is in radians).

```javascript
acos(x: number): number;
```
### atan()

Returns the Arc Tangent of the value specified (return value is in radians).

```javascript
atan(x: number): number;
```
### atan2()

Returns the Arc Tangent of x divided by y (return value is in radians).

```javascript
atan2(x: number, y: number): number;
```
### sqr()

Returns the square of the parameter (similar to x*x, though only evaluating x once).

```javascript
sqr(x: number): number;
```
### sqrt()

Returns the square root of the parameter.

```javascript
sqrt(x: number): number;
```
### pow()

Returns the first parameter raised to the second parameter-th power.
Identical in behavior and performance to the ^ operator.

```javascript
pow(x: number, y: number): number;
```
### exp()

Returns the number e (approx 2.718) raised to the parameter-th power.
This function is significantly faster than pow() or the ^ operator.

```javascript
exp(x: number): number;
```
### log()

Returns the natural logarithm (base e) of the parameter.

```javascript
log(x: number): number;
```
### log10()

Returns the logarithm (base 10) of the parameter.

```javascript
log10(x: number): number;
```
### abs()

Returns the absolute value of the parameter.

```javascript
abs(x: number): number;
```
### min()

Returns the minimum value of the two parameters.

```javascript
min(x: number, y: number): number;
```
### max()

Returns the maximum value of the two parameters.

```javascript
max(x: number, y: number): number;
```
### sign()

Returns the sign of the parameter (-1, 0, or 1).

```javascript
sign(x: number): number;
```
### rand()

Returns a pseudo-random number between 0 and the parameter.

```javascript
rand(x: number): number;
```
### floor()

Rounds the value to the lowest integer possible (floor(3.9)==3, floor(-3.1)==-4).

```javascript
floor(x: number): number;
```
### ceil()

Rounds the value to the highest integer possible (ceil(3.1)==4, ceil(-3.9)==-3).

```javascript
ceil(x: number): number;
```
### invsqrt()

Returns a fast inverse square root (1/sqrt(x)) approximation of the parameter.

```javascript
invsqrt(x: number): number;
```
### spl0

Channel 1 (L) sample variable

```javascript
spl0: number;
```
### spl1

Channel 2 (R) sample variable

```javascript
spl1: number;
```
### spl2

Channel 3 sample variable

```javascript
spl2: number;
```
### spl3

Channel 4 sample variable

```javascript
spl3: number;
```
### spl4

Channel 5 sample variable

```javascript
spl4: number;
```
### spl5

Channel 6 sample variable

```javascript
spl5: number;
```
### spl6

Channel 7 sample variable

```javascript
spl6: number;
```
### spl7

Channel 8 sample variable

```javascript
spl7: number;
```
### spl8

Channel 9 sample variable

```javascript
spl8: number;
```
### spl9

Channel 10 sample variable

```javascript
spl9: number;
```
### spl10

Channel 11 sample variable

```javascript
spl10: number;
```
### spl11

Channel 12 sample variable

```javascript
spl11: number;
```
### spl12

Channel 13 sample variable

```javascript
spl12: number;
```
### spl13

Channel 14 sample variable

```javascript
spl13: number;
```
### spl14

Channel 15 sample variable

```javascript
spl14: number;
```
### spl15

Channel 16 sample variable

```javascript
spl15: number;
```
### spl16

Channel 17 sample variable

```javascript
spl16: number;
```
### spl17

Channel 18 sample variable

```javascript
spl17: number;
```
### spl18

Channel 19 sample variable

```javascript
spl18: number;
```
### spl19

Channel 20 sample variable

```javascript
spl19: number;
```
### spl20

Channel 21 sample variable

```javascript
spl20: number;
```
### spl21

Channel 22 sample variable

```javascript
spl21: number;
```
### spl22

Channel 23 sample variable

```javascript
spl22: number;
```
### spl23

Channel 24 sample variable

```javascript
spl23: number;
```
### spl24

Channel 25 sample variable

```javascript
spl24: number;
```
### spl25

Channel 26 sample variable

```javascript
spl25: number;
```
### spl26

Channel 27 sample variable

```javascript
spl26: number;
```
### spl27

Channel 28 sample variable

```javascript
spl27: number;
```
### spl28

Channel 29 sample variable

```javascript
spl28: number;
```
### spl29

Channel 30 sample variable

```javascript
spl29: number;
```
### spl30

Channel 31 sample variable

```javascript
spl30: number;
```
### spl31

Channel 32 sample variable

```javascript
spl31: number;
```
### spl32

Channel 33 sample variable

```javascript
spl32: number;
```
### spl33

Channel 34 sample variable

```javascript
spl33: number;
```
### spl34

Channel 35 sample variable

```javascript
spl34: number;
```
### spl35

Channel 36 sample variable

```javascript
spl35: number;
```
### spl36

Channel 37 sample variable

```javascript
spl36: number;
```
### spl37

Channel 38 sample variable

```javascript
spl37: number;
```
### spl38

Channel 39 sample variable

```javascript
spl38: number;
```
### spl39

Channel 40 sample variable

```javascript
spl39: number;
```
### spl40

Channel 41 sample variable

```javascript
spl40: number;
```
### spl41

Channel 42 sample variable

```javascript
spl41: number;
```
### spl42

Channel 43 sample variable

```javascript
spl42: number;
```
### spl43

Channel 44 sample variable

```javascript
spl43: number;
```
### spl44

Channel 45 sample variable

```javascript
spl44: number;
```
### spl45

Channel 46 sample variable

```javascript
spl45: number;
```
### spl46

Channel 47 sample variable

```javascript
spl46: number;
```
### spl47

Channel 48 sample variable

```javascript
spl47: number;
```
### spl48

Channel 49 sample variable

```javascript
spl48: number;
```
### spl49

Channel 50 sample variable

```javascript
spl49: number;
```
### spl50

Channel 51 sample variable

```javascript
spl50: number;
```
### spl51

Channel 52 sample variable

```javascript
spl51: number;
```
### spl52

Channel 53 sample variable

```javascript
spl52: number;
```
### spl53

Channel 54 sample variable

```javascript
spl53: number;
```
### spl54

Channel 55 sample variable

```javascript
spl54: number;
```
### spl55

Channel 56 sample variable

```javascript
spl55: number;
```
### spl56

Channel 57 sample variable

```javascript
spl56: number;
```
### spl57

Channel 58 sample variable

```javascript
spl57: number;
```
### spl58

Channel 59 sample variable

```javascript
spl58: number;
```
### spl59

Channel 60 sample variable

```javascript
spl59: number;
```
### spl60

Channel 61 sample variable

```javascript
spl60: number;
```
### spl61

Channel 62 sample variable

```javascript
spl61: number;
```
### spl62

Channel 63 sample variable

```javascript
spl62: number;
```
### spl63

Channel 64 sample variable

```javascript
spl63: number;
```
### $pi

Pi

```javascript
$pi: number;
```
### srate

The sample rate of your project.

```javascript
srate: number;
```
