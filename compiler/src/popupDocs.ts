// This is autogenerated. Do not edit.

export const POPUP_DOCS: {
    [symbolName in string]?: {
        name: string;
        type: 'function' | 'class' | 'constant';
        text: string;
        example: string | null;
        signature: string;
        autoCompleteTemplate: string;
    };
} = {
    config: {
    "name": "config",
    "type": "function",
    "text": "Configures the plugin.",
    "example": "```javascript\nconfig({ description: 'volume', inChannels: 2, outChannels: 2 });\n```",
    "signature": "config({\n    description,\n    inChannels,\n    outChannels,\n    extTailSize\n}: {\n    description: number;\n    inChannels: number;\n    outChannels: number;\n    extTailSize?: number;\n}): void;",
    "autoCompleteTemplate": "config({description: '${}', inChannels: , outChannels: , extTailSize: });"
},
slider: {
    "name": "slider",
    "type": "function",
    "text": "Registers a slider and its bound variable to be displayed in the plugin.",
    "example": "```javascript\nslider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');\n```",
    "signature": "slider(\n    sliderNumber: number,\n    variable: number,\n    initialValue: number,\n    min: number,\n    max: number,\n    step: number,\n    label: string\n): void;",
    "autoCompleteTemplate": "slider(${sliderNumber}, ${variable}, ${initialValue}, ${min}, ${max}, ${step}, ${label});"
},
selectBox: {
    "name": "selectBox",
    "type": "function",
    "text": "Registers a select box and its bound variable to be displayed in the plugin.",
    "example": "```javascript\nselectBox(\n    3,\n    algorithm,\n    'sigmoid',\n    [\n        { name: 'sigmoid', label: 'Sigmoid' },\n        { name: 'htan', label: 'Hyperbolic Tangent' },\n        { name: 'hclip', label: 'Hard Clip' }\n    ],\n    'Algorithm'\n);\n```",
    "signature": "selectBox(\n    sliderNumber: number,\n    variable: string,\n    initialValue: string,\n    values: { name: string; label: string }[],\n    label: string\n): void;",
    "autoCompleteTemplate": "selectBox(${sliderNumber}, ${variable}, ${initialValue}, [${}], ${label});"
},
fileSelector: {
    "name": "fileSelector",
    "type": "function",
    "text": "Registers a file selector to be displayed in the plugin.\n\nThe path is relative to <REAPER_DIR>/data.",
    "example": "```javascript\nfileSelector(\n    5,\n    ampModel,\n    'amp_models',\n    'none',\n    'Impulse Response'\n);\n```",
    "signature": "fileSelector(\n    sliderNumber: number,\n    variable: string,\n    path: string,\n    defaultValue: string,\n    label: string\n): void;",
    "autoCompleteTemplate": "fileSelector(${sliderNumber}, ${variable}, ${path}, ${defaultValue}, ${label});"
},
console: {
    "name": "console",
    "type": "constant",
    "text": "JS2EEL only supports the `.log()` method.\n`console.log()` creates a debug variable to print the value of a variable in the JSFX dev environment.",
    "example": "```javascript\nlet myVal = 3;\nconsole.log(myVal);\n```",
    "signature": "console: {\n    log: (someVar: number | string) => void;\n};",
    "autoCompleteTemplate": "console"
},
onInit: {
    "name": "onInit",
    "type": "function",
    "text": "Init variables and functions here.",
    "example": null,
    "signature": "onInit(callback: () => void): void;",
    "autoCompleteTemplate": "onInit(() => {\n    ${}\n});"
},
onSlider: {
    "name": "onSlider",
    "type": "function",
    "text": "What happens when a slider is moved.",
    "example": null,
    "signature": "onSlider(callback: () => void): void;",
    "autoCompleteTemplate": "onSlider(() => {\n    ${}\n});"
},
onBlock: {
    "name": "onBlock",
    "type": "function",
    "text": "Called for every audio block.",
    "example": null,
    "signature": "onBlock(callback: () => void): void;",
    "autoCompleteTemplate": "onBlock(() => {\n    ${}\n});"
},
onSample: {
    "name": "onSample",
    "type": "function",
    "text": "Called for every single sample.",
    "example": null,
    "signature": "onSample(callback: () => void): void;",
    "autoCompleteTemplate": "onSample(() => {\n    ${}\n});"
},
eachChannel: {
    "name": "eachChannel",
    "type": "function",
    "text": "Iterates over each channel and provides the current sample for manipulation.",
    "example": null,
    "signature": "eachChannel(callback: (sample: number, channel: number) => void): void;",
    "autoCompleteTemplate": "eachChannel((sample, channel) => {\n    ${}\n});"
},
EelBuffer: {
    "name": "EelBuffer",
    "type": "class",
    "text": "A fixed-size, multi-dimensional container for audio samples.\n\nAccess: `buf[dimension][position]`\n\nTranslates to EEL2s memory objects. Is not inlined in the EEL source, so\nonly feasible for large data. For small data, use EelArray.",
    "example": null,
    "signature": "EelBuffer {\n    constructor(dimensions: number, size: number);\n\n    dimensions(): number;\n    size(): number;\n    start(): number;\n    swap(otherBuffer: EelBuffer): void;\n}",
    "autoCompleteTemplate": "EelBuffer(${dimensions}, ${size});"
},
EelArray: {
    "name": "EelArray",
    "type": "class",
    "text": "A fixed-size, multi-dimensional container for numeric data.\n\nAccess: `arr[dimension][position]`\n\nIs inlined in the EEL source, dimensions and size are restricted to 16 each. For large data,\nuse EelBuffer.",
    "example": null,
    "signature": "EelArray {\n    constructor(dimensions: number, size: number);\n\n    dimensions(): number;\n    size(): number;\n}",
    "autoCompleteTemplate": "EelArray(${dimensions}, ${size});"
},
srate: {
    "name": "srate",
    "type": "constant",
    "text": "The sample rate of your project",
    "example": null,
    "signature": "srate: number;",
    "autoCompleteTemplate": "srate"
},
num_ch: {
    "name": "num_ch",
    "type": "constant",
    "text": "Number of channels available",
    "example": null,
    "signature": "num_ch: number;",
    "autoCompleteTemplate": "num_ch"
},
samplesblock: {
    "name": "samplesblock",
    "type": "constant",
    "text": "How many samples will come before the next `onBlock()` call",
    "example": null,
    "signature": "samplesblock: number;",
    "autoCompleteTemplate": "samplesblock"
},
tempo: {
    "name": "tempo",
    "type": "constant",
    "text": "The tempo of your project",
    "example": null,
    "signature": "tempo: number;",
    "autoCompleteTemplate": "tempo"
},
play_state: {
    "name": "play_state",
    "type": "constant",
    "text": "The current playback state of REAPER (0=stopped, <0=error, 1=playing, 2=paused, 5=recording, 6=record paused)",
    "example": null,
    "signature": "play_state: number;",
    "autoCompleteTemplate": "play_state"
},
play_position: {
    "name": "play_position",
    "type": "constant",
    "text": "The current playback position in REAPER (as of last @block), in seconds",
    "example": null,
    "signature": "play_position: number;",
    "autoCompleteTemplate": "play_position"
},
beat_position: {
    "name": "beat_position",
    "type": "constant",
    "text": "Read-only. The current playback position (as of last @block) in REAPER, in beats (beats = quarternotes in /4 time signatures).",
    "example": null,
    "signature": "beat_position: number;",
    "autoCompleteTemplate": "beat_position"
},
ts_num: {
    "name": "ts_num",
    "type": "constant",
    "text": "Read-only. The current time signature numerator, i.e. 3.0 if using 3/4 time.",
    "example": null,
    "signature": "ts_num: number;",
    "autoCompleteTemplate": "ts_num"
},
ts_denom: {
    "name": "ts_denom",
    "type": "constant",
    "text": "Read-only. The current time signature denominator, i.e. 4.0 if using 3/4 time.",
    "example": null,
    "signature": "ts_denom: number;",
    "autoCompleteTemplate": "ts_denom"
},
spl0: {
    "name": "spl0",
    "type": "constant",
    "text": "Channel 1 (L) sample variable",
    "example": null,
    "signature": "spl0: number;",
    "autoCompleteTemplate": "spl0"
},
spl1: {
    "name": "spl1",
    "type": "constant",
    "text": "Channel 2 (R) sample variable",
    "example": null,
    "signature": "spl1: number;",
    "autoCompleteTemplate": "spl1"
},
spl2: {
    "name": "spl2",
    "type": "constant",
    "text": "Channel 3 sample variable",
    "example": null,
    "signature": "spl2: number;",
    "autoCompleteTemplate": "spl2"
},
spl3: {
    "name": "spl3",
    "type": "constant",
    "text": "Channel 4 sample variable",
    "example": null,
    "signature": "spl3: number;",
    "autoCompleteTemplate": "spl3"
},
spl4: {
    "name": "spl4",
    "type": "constant",
    "text": "Channel 5 sample variable",
    "example": null,
    "signature": "spl4: number;",
    "autoCompleteTemplate": "spl4"
},
spl5: {
    "name": "spl5",
    "type": "constant",
    "text": "Channel 6 sample variable",
    "example": null,
    "signature": "spl5: number;",
    "autoCompleteTemplate": "spl5"
},
spl6: {
    "name": "spl6",
    "type": "constant",
    "text": "Channel 7 sample variable",
    "example": null,
    "signature": "spl6: number;",
    "autoCompleteTemplate": "spl6"
},
spl7: {
    "name": "spl7",
    "type": "constant",
    "text": "Channel 8 sample variable",
    "example": null,
    "signature": "spl7: number;",
    "autoCompleteTemplate": "spl7"
},
spl8: {
    "name": "spl8",
    "type": "constant",
    "text": "Channel 9 sample variable",
    "example": null,
    "signature": "spl8: number;",
    "autoCompleteTemplate": "spl8"
},
spl9: {
    "name": "spl9",
    "type": "constant",
    "text": "Channel 10 sample variable",
    "example": null,
    "signature": "spl9: number;",
    "autoCompleteTemplate": "spl9"
},
spl10: {
    "name": "spl10",
    "type": "constant",
    "text": "Channel 11 sample variable",
    "example": null,
    "signature": "spl10: number;",
    "autoCompleteTemplate": "spl10"
},
spl11: {
    "name": "spl11",
    "type": "constant",
    "text": "Channel 12 sample variable",
    "example": null,
    "signature": "spl11: number;",
    "autoCompleteTemplate": "spl11"
},
spl12: {
    "name": "spl12",
    "type": "constant",
    "text": "Channel 13 sample variable",
    "example": null,
    "signature": "spl12: number;",
    "autoCompleteTemplate": "spl12"
},
spl13: {
    "name": "spl13",
    "type": "constant",
    "text": "Channel 14 sample variable",
    "example": null,
    "signature": "spl13: number;",
    "autoCompleteTemplate": "spl13"
},
spl14: {
    "name": "spl14",
    "type": "constant",
    "text": "Channel 15 sample variable",
    "example": null,
    "signature": "spl14: number;",
    "autoCompleteTemplate": "spl14"
},
spl15: {
    "name": "spl15",
    "type": "constant",
    "text": "Channel 16 sample variable",
    "example": null,
    "signature": "spl15: number;",
    "autoCompleteTemplate": "spl15"
},
spl16: {
    "name": "spl16",
    "type": "constant",
    "text": "Channel 17 sample variable",
    "example": null,
    "signature": "spl16: number;",
    "autoCompleteTemplate": "spl16"
},
spl17: {
    "name": "spl17",
    "type": "constant",
    "text": "Channel 18 sample variable",
    "example": null,
    "signature": "spl17: number;",
    "autoCompleteTemplate": "spl17"
},
spl18: {
    "name": "spl18",
    "type": "constant",
    "text": "Channel 19 sample variable",
    "example": null,
    "signature": "spl18: number;",
    "autoCompleteTemplate": "spl18"
},
spl19: {
    "name": "spl19",
    "type": "constant",
    "text": "Channel 20 sample variable",
    "example": null,
    "signature": "spl19: number;",
    "autoCompleteTemplate": "spl19"
},
spl20: {
    "name": "spl20",
    "type": "constant",
    "text": "Channel 21 sample variable",
    "example": null,
    "signature": "spl20: number;",
    "autoCompleteTemplate": "spl20"
},
spl21: {
    "name": "spl21",
    "type": "constant",
    "text": "Channel 22 sample variable",
    "example": null,
    "signature": "spl21: number;",
    "autoCompleteTemplate": "spl21"
},
spl22: {
    "name": "spl22",
    "type": "constant",
    "text": "Channel 23 sample variable",
    "example": null,
    "signature": "spl22: number;",
    "autoCompleteTemplate": "spl22"
},
spl23: {
    "name": "spl23",
    "type": "constant",
    "text": "Channel 24 sample variable",
    "example": null,
    "signature": "spl23: number;",
    "autoCompleteTemplate": "spl23"
},
spl24: {
    "name": "spl24",
    "type": "constant",
    "text": "Channel 25 sample variable",
    "example": null,
    "signature": "spl24: number;",
    "autoCompleteTemplate": "spl24"
},
spl25: {
    "name": "spl25",
    "type": "constant",
    "text": "Channel 26 sample variable",
    "example": null,
    "signature": "spl25: number;",
    "autoCompleteTemplate": "spl25"
},
spl26: {
    "name": "spl26",
    "type": "constant",
    "text": "Channel 27 sample variable",
    "example": null,
    "signature": "spl26: number;",
    "autoCompleteTemplate": "spl26"
},
spl27: {
    "name": "spl27",
    "type": "constant",
    "text": "Channel 28 sample variable",
    "example": null,
    "signature": "spl27: number;",
    "autoCompleteTemplate": "spl27"
},
spl28: {
    "name": "spl28",
    "type": "constant",
    "text": "Channel 29 sample variable",
    "example": null,
    "signature": "spl28: number;",
    "autoCompleteTemplate": "spl28"
},
spl29: {
    "name": "spl29",
    "type": "constant",
    "text": "Channel 30 sample variable",
    "example": null,
    "signature": "spl29: number;",
    "autoCompleteTemplate": "spl29"
},
spl30: {
    "name": "spl30",
    "type": "constant",
    "text": "Channel 31 sample variable",
    "example": null,
    "signature": "spl30: number;",
    "autoCompleteTemplate": "spl30"
},
spl31: {
    "name": "spl31",
    "type": "constant",
    "text": "Channel 32 sample variable",
    "example": null,
    "signature": "spl31: number;",
    "autoCompleteTemplate": "spl31"
},
spl32: {
    "name": "spl32",
    "type": "constant",
    "text": "Channel 33 sample variable",
    "example": null,
    "signature": "spl32: number;",
    "autoCompleteTemplate": "spl32"
},
spl33: {
    "name": "spl33",
    "type": "constant",
    "text": "Channel 34 sample variable",
    "example": null,
    "signature": "spl33: number;",
    "autoCompleteTemplate": "spl33"
},
spl34: {
    "name": "spl34",
    "type": "constant",
    "text": "Channel 35 sample variable",
    "example": null,
    "signature": "spl34: number;",
    "autoCompleteTemplate": "spl34"
},
spl35: {
    "name": "spl35",
    "type": "constant",
    "text": "Channel 36 sample variable",
    "example": null,
    "signature": "spl35: number;",
    "autoCompleteTemplate": "spl35"
},
spl36: {
    "name": "spl36",
    "type": "constant",
    "text": "Channel 37 sample variable",
    "example": null,
    "signature": "spl36: number;",
    "autoCompleteTemplate": "spl36"
},
spl37: {
    "name": "spl37",
    "type": "constant",
    "text": "Channel 38 sample variable",
    "example": null,
    "signature": "spl37: number;",
    "autoCompleteTemplate": "spl37"
},
spl38: {
    "name": "spl38",
    "type": "constant",
    "text": "Channel 39 sample variable",
    "example": null,
    "signature": "spl38: number;",
    "autoCompleteTemplate": "spl38"
},
spl39: {
    "name": "spl39",
    "type": "constant",
    "text": "Channel 40 sample variable",
    "example": null,
    "signature": "spl39: number;",
    "autoCompleteTemplate": "spl39"
},
spl40: {
    "name": "spl40",
    "type": "constant",
    "text": "Channel 41 sample variable",
    "example": null,
    "signature": "spl40: number;",
    "autoCompleteTemplate": "spl40"
},
spl41: {
    "name": "spl41",
    "type": "constant",
    "text": "Channel 42 sample variable",
    "example": null,
    "signature": "spl41: number;",
    "autoCompleteTemplate": "spl41"
},
spl42: {
    "name": "spl42",
    "type": "constant",
    "text": "Channel 43 sample variable",
    "example": null,
    "signature": "spl42: number;",
    "autoCompleteTemplate": "spl42"
},
spl43: {
    "name": "spl43",
    "type": "constant",
    "text": "Channel 44 sample variable",
    "example": null,
    "signature": "spl43: number;",
    "autoCompleteTemplate": "spl43"
},
spl44: {
    "name": "spl44",
    "type": "constant",
    "text": "Channel 45 sample variable",
    "example": null,
    "signature": "spl44: number;",
    "autoCompleteTemplate": "spl44"
},
spl45: {
    "name": "spl45",
    "type": "constant",
    "text": "Channel 46 sample variable",
    "example": null,
    "signature": "spl45: number;",
    "autoCompleteTemplate": "spl45"
},
spl46: {
    "name": "spl46",
    "type": "constant",
    "text": "Channel 47 sample variable",
    "example": null,
    "signature": "spl46: number;",
    "autoCompleteTemplate": "spl46"
},
spl47: {
    "name": "spl47",
    "type": "constant",
    "text": "Channel 48 sample variable",
    "example": null,
    "signature": "spl47: number;",
    "autoCompleteTemplate": "spl47"
},
spl48: {
    "name": "spl48",
    "type": "constant",
    "text": "Channel 49 sample variable",
    "example": null,
    "signature": "spl48: number;",
    "autoCompleteTemplate": "spl48"
},
spl49: {
    "name": "spl49",
    "type": "constant",
    "text": "Channel 50 sample variable",
    "example": null,
    "signature": "spl49: number;",
    "autoCompleteTemplate": "spl49"
},
spl50: {
    "name": "spl50",
    "type": "constant",
    "text": "Channel 51 sample variable",
    "example": null,
    "signature": "spl50: number;",
    "autoCompleteTemplate": "spl50"
},
spl51: {
    "name": "spl51",
    "type": "constant",
    "text": "Channel 52 sample variable",
    "example": null,
    "signature": "spl51: number;",
    "autoCompleteTemplate": "spl51"
},
spl52: {
    "name": "spl52",
    "type": "constant",
    "text": "Channel 53 sample variable",
    "example": null,
    "signature": "spl52: number;",
    "autoCompleteTemplate": "spl52"
},
spl53: {
    "name": "spl53",
    "type": "constant",
    "text": "Channel 54 sample variable",
    "example": null,
    "signature": "spl53: number;",
    "autoCompleteTemplate": "spl53"
},
spl54: {
    "name": "spl54",
    "type": "constant",
    "text": "Channel 55 sample variable",
    "example": null,
    "signature": "spl54: number;",
    "autoCompleteTemplate": "spl54"
},
spl55: {
    "name": "spl55",
    "type": "constant",
    "text": "Channel 56 sample variable",
    "example": null,
    "signature": "spl55: number;",
    "autoCompleteTemplate": "spl55"
},
spl56: {
    "name": "spl56",
    "type": "constant",
    "text": "Channel 57 sample variable",
    "example": null,
    "signature": "spl56: number;",
    "autoCompleteTemplate": "spl56"
},
spl57: {
    "name": "spl57",
    "type": "constant",
    "text": "Channel 58 sample variable",
    "example": null,
    "signature": "spl57: number;",
    "autoCompleteTemplate": "spl57"
},
spl58: {
    "name": "spl58",
    "type": "constant",
    "text": "Channel 59 sample variable",
    "example": null,
    "signature": "spl58: number;",
    "autoCompleteTemplate": "spl58"
},
spl59: {
    "name": "spl59",
    "type": "constant",
    "text": "Channel 60 sample variable",
    "example": null,
    "signature": "spl59: number;",
    "autoCompleteTemplate": "spl59"
},
spl60: {
    "name": "spl60",
    "type": "constant",
    "text": "Channel 61 sample variable",
    "example": null,
    "signature": "spl60: number;",
    "autoCompleteTemplate": "spl60"
},
spl61: {
    "name": "spl61",
    "type": "constant",
    "text": "Channel 62 sample variable",
    "example": null,
    "signature": "spl61: number;",
    "autoCompleteTemplate": "spl61"
},
spl62: {
    "name": "spl62",
    "type": "constant",
    "text": "Channel 63 sample variable",
    "example": null,
    "signature": "spl62: number;",
    "autoCompleteTemplate": "spl62"
},
spl63: {
    "name": "spl63",
    "type": "constant",
    "text": "Channel 64 sample variable",
    "example": null,
    "signature": "spl63: number;",
    "autoCompleteTemplate": "spl63"
},
$pi: {
    "name": "$pi",
    "type": "constant",
    "text": "Pi",
    "example": null,
    "signature": "$pi: number;",
    "autoCompleteTemplate": "$pi"
},
sin: {
    "name": "sin",
    "type": "function",
    "text": "Returns the Sine of the angle specified (specified in radians).",
    "example": null,
    "signature": "sin(angle: number): number;",
    "autoCompleteTemplate": "sin(${angle});"
},
cos: {
    "name": "cos",
    "type": "function",
    "text": "Returns the Cosine of the angle specified (specified in radians).",
    "example": null,
    "signature": "cos(angle: number): number;",
    "autoCompleteTemplate": "cos(${angle});"
},
tan: {
    "name": "tan",
    "type": "function",
    "text": "Returns the Tangent of the angle specified (specified in radians).",
    "example": null,
    "signature": "tan(angle: number): number;",
    "autoCompleteTemplate": "tan(${angle});"
},
asin: {
    "name": "asin",
    "type": "function",
    "text": "Returns the Arc Sine of the value specified (return value is in radians).",
    "example": null,
    "signature": "asin(x: number): number;",
    "autoCompleteTemplate": "asin(${x});"
},
acos: {
    "name": "acos",
    "type": "function",
    "text": "Returns the Arc Cosine of the value specified (return value is in radians).",
    "example": null,
    "signature": "acos(x: number): number;",
    "autoCompleteTemplate": "acos(${x});"
},
atan: {
    "name": "atan",
    "type": "function",
    "text": "Returns the Arc Tangent of the value specified (return value is in radians).",
    "example": null,
    "signature": "atan(x: number): number;",
    "autoCompleteTemplate": "atan(${x});"
},
atan2: {
    "name": "atan2",
    "type": "function",
    "text": "Returns the Arc Tangent of x divided by y (return value is in radians).",
    "example": null,
    "signature": "atan2(x: number, y: number): number;",
    "autoCompleteTemplate": "atan2(${x}, ${y});"
},
sqr: {
    "name": "sqr",
    "type": "function",
    "text": "Returns the square of the parameter (similar to x*x, though only evaluating x once).",
    "example": null,
    "signature": "sqr(x: number): number;",
    "autoCompleteTemplate": "sqr(${x});"
},
sqrt: {
    "name": "sqrt",
    "type": "function",
    "text": "Returns the square root of the parameter.",
    "example": null,
    "signature": "sqrt(x: number): number;",
    "autoCompleteTemplate": "sqrt(${x});"
},
pow: {
    "name": "pow",
    "type": "function",
    "text": "Returns the first parameter raised to the second parameter-th power.\nIdentical in behavior and performance to the ^ operator.",
    "example": null,
    "signature": "pow(x: number, y: number): number;",
    "autoCompleteTemplate": "pow(${x}, ${y});"
},
exp: {
    "name": "exp",
    "type": "function",
    "text": "Returns the number e (approx 2.718) raised to the parameter-th power.\nThis function is significantly faster than pow() or the ^ operator.",
    "example": null,
    "signature": "exp(x: number): number;",
    "autoCompleteTemplate": "exp(${x});"
},
log: {
    "name": "log",
    "type": "function",
    "text": "Returns the natural logarithm (base e) of the parameter.",
    "example": null,
    "signature": "log(x: number): number;",
    "autoCompleteTemplate": "log(${x});"
},
log10: {
    "name": "log10",
    "type": "function",
    "text": "Returns the logarithm (base 10) of the parameter.",
    "example": null,
    "signature": "log10(x: number): number;",
    "autoCompleteTemplate": "log10(${x});"
},
abs: {
    "name": "abs",
    "type": "function",
    "text": "Returns the absolute value of the parameter.",
    "example": null,
    "signature": "abs(x: number): number;",
    "autoCompleteTemplate": "abs(${x});"
},
min: {
    "name": "min",
    "type": "function",
    "text": "Returns the minimum value of the two parameters.",
    "example": null,
    "signature": "min(x: number, y: number): number;",
    "autoCompleteTemplate": "min(${x}, ${y});"
},
max: {
    "name": "max",
    "type": "function",
    "text": "Returns the maximum value of the two parameters.",
    "example": null,
    "signature": "max(x: number, y: number): number;",
    "autoCompleteTemplate": "max(${x}, ${y});"
},
sign: {
    "name": "sign",
    "type": "function",
    "text": "Returns the sign of the parameter (-1, 0, or 1).",
    "example": null,
    "signature": "sign(x: number): number;",
    "autoCompleteTemplate": "sign(${x});"
},
rand: {
    "name": "rand",
    "type": "function",
    "text": "Returns a pseudo-random number between 0 and the parameter.",
    "example": null,
    "signature": "rand(x: number): number;",
    "autoCompleteTemplate": "rand(${x});"
},
floor: {
    "name": "floor",
    "type": "function",
    "text": "Rounds the value to the lowest integer possible (floor(3.9)==3, floor(-3.1)==-4).",
    "example": null,
    "signature": "floor(x: number): number;",
    "autoCompleteTemplate": "floor(${x});"
},
ceil: {
    "name": "ceil",
    "type": "function",
    "text": "Rounds the value to the highest integer possible (ceil(3.1)==4, ceil(-3.9)==-3).",
    "example": null,
    "signature": "ceil(x: number): number;",
    "autoCompleteTemplate": "ceil(${x});"
},
invsqrt: {
    "name": "invsqrt",
    "type": "function",
    "text": "Returns a fast inverse square root (1/sqrt(x)) approximation of the parameter.",
    "example": null,
    "signature": "invsqrt(x: number): number;",
    "autoCompleteTemplate": "invsqrt(${x});"
},
memset: {
    "name": "memset",
    "type": "function",
    "text": "",
    "example": null,
    "signature": "memset(): void;",
    "autoCompleteTemplate": "memset();"
},
file_open: {
    "name": "file_open",
    "type": "function",
    "text": "Opens a file from a file slider. Once open, you may use all of the file functions available. Be sure to close the file handle when done with it, using file_close(). The search path for finding files depends on the method used, but generally speaking in 4.59+ it will look in the same path as the current effect, then in the JS Data/ directory.\n\n@param fileSelector A variable that is bound to the respective file selector. Will be compiled to sliderXY. FIXME types",
    "example": null,
    "signature": "file_open(fileSelector: any): number;",
    "autoCompleteTemplate": "file_open();"
},
file_close: {
    "name": "file_close",
    "type": "function",
    "text": "Closes a file opened with file_open().",
    "example": null,
    "signature": "file_close(fileHandle: any): void;",
    "autoCompleteTemplate": "file_close();"
},
file_avail: {
    "name": "file_avail",
    "type": "function",
    "text": "Returns the number of items remaining in the file, if it is in read mode. Returns < 0 if in write mode. If the file is in text mode (file_text(handle) returns TRUE), then the return value is simply 0 if EOF, 1 if not EOF.",
    "example": null,
    "signature": "file_avail(fileSelector: any): number;",
    "autoCompleteTemplate": "file_avail();"
},
file_riff: {
    "name": "file_riff",
    "type": "function",
    "text": "If the file was a media file (.wav, .ogg, etc), this will set the first parameter to the number of channels, and the second to the samplerate.\n\nREAPER 6.29+: if the caller sets nch to 'rqsr' and samplerate to a valid samplerate, the file will be resampled to the desired samplerate (this must ONLY be called before any file_var() or file_mem() calls and will change the value returned by file_avail())",
    "example": null,
    "signature": "file_riff(fileHandle: any, numberOfCh: number, sampleRate: number): void;",
    "autoCompleteTemplate": "file_riff(${numberOfCh}, ${sampleRate});"
},
file_mem: {
    "name": "file_mem",
    "type": "function",
    "text": "Reads (or writes) the block of local memory from(to) the current file. Returns the actual number of items read (or written).",
    "example": null,
    "signature": "file_mem(fileHandle: any, offset: number, length: number): number;",
    "autoCompleteTemplate": "file_mem(${offset}, ${length});"
},
fft: {
    "name": "fft",
    "type": "function",
    "text": "Performs a FFT (or inverse in the case of ifft()) on the data in the local memory buffer at the offset specified by the first parameter. The size of the FFT is specified by the second parameter, which must be 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, or 32768. The outputs are permuted, so if you plan to use them in-order, call fft_permute(buffer, size) before and fft_ipermute(buffer,size) after your in-order use. Your inputs or outputs will need to be scaled down by 1/size, if used.\n\nNote that the FFT/IFFT require real/imaginary input pairs (so a 256 point FFT actually works with 512 items).\n\nNote that the FFT/IFFT must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.\n\nThe fft_real()/ifft_real() variants operate on a set of size real inputs, and produce size/2 complex outputs. The first output pair is DC,nyquist. Normally this is used with fft_permute(buffer,size/2).",
    "example": null,
    "signature": "fft(startIndex: number, size: number): void;",
    "autoCompleteTemplate": "fft(${startIndex}, ${size});"
},
ifft: {
    "name": "ifft",
    "type": "function",
    "text": "Performs a FFT (or inverse in the case of ifft()) on the data in the local memory buffer at the offset specified by the first parameter. The size of the FFT is specified by the second parameter, which must be 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, or 32768. The outputs are permuted, so if you plan to use them in-order, call fft_permute(buffer, size) before and fft_ipermute(buffer,size) after your in-order use. Your inputs or outputs will need to be scaled down by 1/size, if used.\n\nNote that the FFT/IFFT require real/imaginary input pairs (so a 256 point FFT actually works with 512 items).\n\nNote that the FFT/IFFT must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.\n\nThe fft_real()/ifft_real() variants operate on a set of size real inputs, and produce size/2 complex outputs. The first output pair is DC,nyquist. Normally this is used with fft_permute(buffer,size/2).",
    "example": null,
    "signature": "ifft(startIndex: number, size: number): void;",
    "autoCompleteTemplate": "ifft(${startIndex}, ${size});"
},
convolve_c: {
    "name": "convolve_c",
    "type": "function",
    "text": "Used to convolve two buffers, typically after FFTing them. convolve_c works with complex numbers. The sizes specify number of items (the number of complex number pairs).\n\nNote that the convolution must NOT cross a 65,536 item boundary, so be sure to specify the offset accordingly.",
    "example": null,
    "signature": "convolve_c(destination: number, source: number, size: number): void;",
    "autoCompleteTemplate": "convolve_c(${destination}, ${source}, ${size});"
}
};
