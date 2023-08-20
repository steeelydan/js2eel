## Getting Started: Your First JS2EEL Plugin

Let's create our first JS2EEL plugin. We'll write it in JavaScript. JS2EEL will compile it into a REAPER JSFX plugin that you can use instantly.

Our plugin will take an input audio signal and modify its volume. If you'd like to see the finished plugin, feel free to load the example plugin `volume.js`.

### Step 1: Create a New File

Click on the "New File" button in the upper left half of the window.

A modal will appear where you have to enter a `filename` for the JavaScript code and a `description` that will be used to reference the JSFX plugin in REAPER. Let's start with the same value for both: `volume`.

As you create the new file, the JS code tab will be pre-populated with a minimal template. There will be a call to the `config()` function, where the name and the channel configuration of the plugin is defined:

```javascript
config({ description: 'volume', inChannels: 2, outChannels: 2 });
```

Take a look at the resulting JSFX code on the right. If you're familiar with JSFX, you'll meet some old friends here: `desc:` and the `in_pin` and `out_pin` configuration for your plugin's channel routing.

Additionally, a template for the `onSample()` function call is provided. This is a JS2EEL library function that iterates through every sample of the audio block and allows you to modify it. This corresponds to the `@sample` part in JSFX.

### Step 2: Declare Volume Adjustment Holder Variables

Next, we will create variables to hold the current volume level and the target volume level. Between `config()` and `onSample()`, add the following code:

```javascript
let volume = 0;
let target = 0;
```

`volume` represents the volume in dB, and `target` represents the target volume in linear scale.

### Step 3: Create a Slider for User Input

To allow the user to adjust the volume, we'll use a slider. We'll bind that slider to the `volume` variable created above. After the variable declarations, add the following code to your file:

```javascript
slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');
```

As you might know, slider numbering is important in EEL. It starts at 1, and so our slider takes `1` as the first argument.

The second argument is the variable to bind to: `volume`.

The third argument is the default value: `0`.

The fourth and fifth arguments are the minimum and maximum values: `-150` and `18` dB, respectively.

The sixth argument is the step size: `0.1`.

The last argument is the label for the slider which will be displayed in the GUI: `Volume [dB]`.

### Step 4: Handle Slider Value Changes

Now, we need to update the target variable whenever the user adjusts the slider. We'll use the `onSlider()` library function to handle slider value changes. This corresponds to EEL's `@slider`. After the slider definition via `slider()`, add the following code to your file:

```javascript
onSlider(() => {
    if (volume > -149.9) {
        target = Math.pow(10, volume / 20);
    } else {
        target = 0;
    }
});
```

Here we assign a linear target level to the `target` variable, which will be used later to adjust our sample amplitude. If the slider is at its lower boundary, we set the target to 0 to mute the audio.

### Step 5: Process Audio Samples

The final step is to process audio samples based on the calculated target volume. We'll use the `onSample()` function to perform audio processing. This corresponds to EEL's `@sample`. In the callback arrow function parameter of `onSample()`, add the following code:

```javascript
eachChannel((sample, _ch) => {
    sample *= target;
});
```

`eachChannel()` is another JS2EEL library function that makes it easy to manipulate samples per channel. It can only be called in onSample. It has no equivalent in EEL. We just multiply every sample in each of the two channels by the target volume to adjust its amplitude respectively.

### Finished Plugin

Here is the complete code:

```javascript
config({ description: 'volume', inChannels: 2, outChannels: 2 });

let volume = 0;
let target = 0;

slider(1, volume, 0, -150, 18, 0.1, 'Volume [dB]');

onSlider(() => {
    if (volume > -149.9) {
        target = Math.pow(10, volume / 20);
    } else {
        target = 0;
    }
});

onSample(() => {
    eachChannel((sample, _ch) => {
        sample *= target;
    });
});
```

### Conclusion

That's it! You've successfully created a simple volume plugin using JS2EEL. If you're using the web app version of JS2EEL, copy the JSFX code into a new JSFX in REAPER to hear it in action. If you're using the desktop app and have configured the output path correctly, your `volume` JSFX should appear in the `JS` subdirectory of the FX selector.

Feel free to take a look at the other examples. You'll be inspired to write your own JS2EEL plugin in no time!
