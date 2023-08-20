/**
 * The name of the plugin, most often.
 */
declare function description(description: string): void;

/**
 * Registers a slider and its bound variable to be displayed in the plugin.
 */
declare function slider(
    variable: number,
    initialValue: number,
    min: number,
    max: number,
    step: number,
    label: string
): void;

/**
 * Init variables and functions here.
 */
declare function onInit(callback: () => void): void;

/**
 * What happens when a slider is moved.
 */
declare function onSliders(callback: () => void): void;

/**
 * Called for every single sample.
 */
declare function onSample(callback: () => void): void;

// System variables

/** Channel 1 (L) sample variable */
declare let spl0: number;
/** Channel 2 (R) sample variable */
declare let spl1: number;

declare let $pi: number;
/** The sample rate of your project. */
declare let srate: number;
