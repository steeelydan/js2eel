## JSFX Features Implemented

### File Structure and Utility Features

| Done | Feature       | Comment                        |
| ---- | ------------- | ------------------------------ |
| ✅   | desc          | `description(yourDescription)` |
| 🕒   | tags          |                                |
| 🕒   | import        |                                |
| ✅   | @init         | `onInit(callback)`             |
| ✅   | @slider       | `onSlider(callback)`           |
| 🕒   | @block        |                                |
| ✅   | @sample       | `onSample(callback)`           |
| 🕒   | @serialize    |                                |
| 🕒   | @gfx          |                                |
| 🕒   | options       |                                |
| 🕒   | JSFX comments |                                |

### UI

| Done | Feature        | Comment                                              |
| ---- | -------------- | ---------------------------------------------------- |
| ✅   | slider: Normal | `slider(identifier, default, min, max, step, label)` |
| ✅   | slider: Select |                                                      |
| 🕒   | slider: File   |                                                      |
| 🕒   | Hidden sliders |                                                      |
| 🕒   | Slider: curves |

### Routing and Input

| Done | Feature         | Comment |
| ---- | --------------- | ------- |
| ✅   | in_pin, out_pin |         |
| 🕒   | filename        |         |
| 🕒   | file_open()     |         |

### Memory and Encodings

| Done | Feature                                    | Comment         |
| ---- | ------------------------------------------ | --------------- |
| ✅   | Local variables                            | `let` & `const` |
| ✅   | Local address space (buffers)              |                 |
| 🕒   | Local address space 8m word restriction    |                 |
| 🕒   | Global address space (`gmem[]`)            |                 |
| 🕒   | Named global address space                 |                 |
| 🕒   | Global named variables (`_global.` prefix) |                 |
| 🕒   | Hex numbers                                |                 |
| 🕒   | ASCII chars                                |                 |
| 🕒   | Bitmasks                                   |                 |
| ✅   | Strings                                    |                 |

### Control Structures

| Done | Feature                         | Comment |
| ---- | ------------------------------- | ------- |
| ✅   | Functions                       |         |
| ✅   | Conditionals                    |         |
| ✅   | Conditional Branching           |         |
| 🕒   | `loop(counter, actions...)`     |         |
| 🕒   | `while(actions..., condition)`  |         |
| 🕒   | `while(condition) (actions...)` |         |

### Operators

| Done | Feature                   | Comment                          |
| ---- | ------------------------- | -------------------------------- |
| ✅   | `!value`                  |                                  |
| ✅   | `-value`                  |                                  |
| ✅   | `+value`                  |                                  |
| ✅   | `base ^ exponent`         | `Math.pow(base, exponent) or **` |
| ✅   | `numerator % denominator` |                                  |
| 🕒   | `value << shift_amt`      |                                  |
| 🕒   | `value >> shift_amt`      |                                  |
| ✅   | `value / divisor`         |                                  |
| ✅   | `value * another_value`   |                                  |
| ✅   | `value - another_value`   |                                  |
| ✅   | `value + another_value`   |                                  |
| 🕒   | `a \| b`                  |                                  |
| 🕒   | `a & b`                   |                                  |
| 🕒   | `a ~ b`                   |                                  |
| ✅   | `value1 == value2`        |                                  |
| ✅   | `value1 === value2`       |                                  |
| ✅   | `value1 != value2`        |                                  |
| ✅   | `value1 !== value2`       |                                  |
| ✅   | `value1 < value2`         |                                  |
| ✅   | `value1 > value2`         |                                  |
| ✅   | `value1 <= value2`        |                                  |
| ✅   | `value1 >= value2`        |                                  |
| ✅   | `y \|\| z`                |                                  |
| ✅   | `y && z`                  |                                  |
| ✅   | `y ? z`                   |                                  |
| ✅   | `y ? z : x`               |                                  |
| ✅   | `y = z`                   |                                  |
| ✅   | `y *= z`                  |                                  |
| ✅   | `y /= divisor`            |                                  |
| ✅   | `y %= divisor`            |                                  |
| 🕒   | `base ^= exponent`        |                                  |
| ✅   | `y += z`                  |                                  |
| ✅   | `y -= z`                  |                                  |
| 🕒   | `y \| = z`                |                                  |
| 🕒   | `y &= z`                  |                                  |
| 🕒   | `y ~= z`                  |                                  |

### Library Functions

| Done | Feature             | Comment |
| ---- | ------------------- | ------- |
| ✅   | `sin(angle)`        |         |
| ✅   | `cos(angle)`        |         |
| ✅   | `tan(angle)`        |         |
| ✅   | `asin(x)`           |         |
| ✅   | `acos(x)`           |         |
| ✅   | `atan(x)`           |         |
| ✅   | `atan2(x, y)`       |         |
| ✅   | `sqr(x)`            |         |
| ✅   | `sqrt(x)`           |         |
| ✅   | `pow(x, y)`         |         |
| ✅   | `exp(x)`            |         |
| ✅   | `log(x)`            |         |
| ✅   | `log10(x)`          |         |
| ✅   | `abs(x)`            |         |
| ✅   | `min(x, y)`         |         |
| ✅   | `max(x, y)`         |         |
| ✅   | `sign(x)`           |         |
| ✅   | `rand(x)`           |         |
| ✅   | `floor(x)`          |         |
| ✅   | `ceil(x)`           |         |
| ✅   | `invsqrt(x)`        |         |
| 🕒   | `time([v])`         |         |
| 🕒   | `time_precise([v])` |         |

### Special Vars & Functions

| Done | Feature                                                             | Comment          |
| ---- | ------------------------------------------------------------------- | ---------------- |
| ✅   | `spl0` - `spl63`                                                    | Only in @sample. |
| 🕒   | `slider(sliderIndex)` (Programmatically access slider)              |                  |
| 🕒   | `slider_next_chg(sliderindex,nextval)` (Sample accurate automation) |                  |
| 🕒   | `trigger()`                                                         |                  |
| ✅   | `srate`                                                             |                  |
| 🕒   | `num_ch`                                                            |                  |
| 🕒   | `samplesblock`                                                      |                  |
| 🕒   | `tempo`                                                             |                  |
| 🕒   | `play_state`                                                        |                  |
| 🕒   | `play_position`                                                     |                  |
| 🕒   | `beat_position`                                                     |                  |
| 🕒   | `ts_num`                                                            |                  |
| 🕒   | `ts_denom`                                                          |                  |
| 🕒   | `ext_noinit`                                                        |                  |
| 🕒   | `ext_nodenorm`                                                      |                  |
| 🕒   | `ext_tail_size`                                                     |                  |
| 🕒   | `reg00-reg99`                                                       |                  |
| 🕒   | `_global.*`                                                         |                  |
| 🕒   | `pdc_delay`                                                         |                  |
| 🕒   | `pdc_bot_ch`                                                        |                  |
| 🕒   | `pdc_top_ch`                                                        |                  |
| 🕒   | `pdc_midi`                                                          |                  |
