# Feature Comparison with JSFX

JSFX Reference: https://www.reaper.fm/sdk/js/js.php

Find the JS2EEL type declarations [here](https://github.com/steeelydan/js2eel/blob/main/compiler/js2eel.d.ts). The [API Docs](https://github.com/steeelydan/js2eel/blob/main/docs/api-documentation.md) are created from that file, as well as the code completion.

✅: Implemented

🕒: Should be implemented

❌: Won't be implemented

❔: Unknown if feasible, useful, or working properly

## Description Lines and Utility Features

| Status | Feature       | Comment                           |
| ------ | ------------- | --------------------------------- |
| ✅     | `desc`        | Implemented as part of `config()` |
| 🕒     | `tags`        |                                   |
| 🕒     | `options`     |                                   |
| 🕒     | JSFX comments |                                   |

## Code Sections

| Status | Feature      | Comment                             |
| ------ | ------------ | ----------------------------------- |
| ✅     | `@init`      | `onInit()`                          |
| ✅     | `@slider`    | `onSlider()`                        |
| 🕒     | `@block`     |                                     |
| ✅     | `@sample`    | `onSample()`                        |
| 🕒     | `@serialize` |                                     |
| 🕒     | `@gfx`       | Declarative with React-like syntax? |

## File Handling

| Status | Feature                              | Comment                    |
| ------ | ------------------------------------ | -------------------------- |
| 🕒     | `import`                             |                            |
| 🕒     | `filename`                           |                            |
| ✅     | `file_open(index \| slider)`         | Slider variant implemented |
| ✅     | `file_close(handle)`                 |                            |
| 🕒     | `file_rewind(handle)`                |                            |
| 🕒     | `file_var(handle, variable)`         |                            |
| ✅     | `file_mem(handle, offset, length)`   |                            |
| ✅     | `file_avail(handle)`                 |                            |
| ✅     | `file_riff(handle, nch, samplerate)` |                            |
| 🕒     | `file_text(handle, istext)`          |                            |
| 🕒     | `file_string(handle,str)`            |                            |

## Routing and Input

| Status | Feature             | Comment                           |
| ------ | ------------------- | --------------------------------- |
| ✅     | `in_pin`, `out_pin` | Implemented as part of `config()` |

## UI

| Status | Feature                                | Comment                                                       |
| ------ | -------------------------------------- | ------------------------------------------------------------- |
| ✅     | Slider: Normal                         | `slider()`                                                    |
| ✅     | Slider: Select                         | `selectBox()`                                                 |
| ✅     | Slider: File                           |                                                               |
| 🕒     | Hidden sliders                         |                                                               |
| 🕒     | Slider: shapes                         |                                                               |
| ❌     | `slider(index)`                        | Might not be necessary as every slider is bound to a variable |
| 🕒     | `slider_next_chg(sliderindex,nextval)` |                                                               |

## Sample Access

| Status | Feature          | Comment |
| ------ | ---------------- | ------- |
| ✅     | `spl0` - `spl63` |         |
| ✅     | `spl(index)`     |         |

## Audio and Transport State Vars

| Status | Feature         | Comment |
| ------ | --------------- | ------- |
| ✅     | `srate`         |         |
| ✅     | `num_ch`        |         |
| ✅     | `samplesblock`  |         |
| ✅     | `tempo`         |         |
| ✅     | `play_state`    |         |
| ✅     | `play_position` |         |
| ✅     | `beat_position` |         |
| ✅     | `ts_num`        |         |
| ✅     | `ts_denom`      |         |

## Data Structures and Encodings

| Status | Feature                                    | Comment                                                         |
| ------ | ------------------------------------------ | --------------------------------------------------------------- |
| ✅     | Local variables                            | `let` & `const`                                                 |
| ✅     | Local address space (buffers)              | `EelBuffer` (equivalent to JSFX buffers) & `EelArray` (inlined) |
| ❔     | Local address space 8m word restriction    |                                                                 |
| 🕒     | Global address space (`gmem[]`)            |                                                                 |
| 🕒     | Named global address space                 |                                                                 |
| ❔     | Global named variables (`_global.` prefix) |                                                                 |
| 🕒     | Hex numbers                                |                                                                 |
| 🕒     | ASCII chars                                |                                                                 |
| 🕒     | Bitmasks                                   |                                                                 |
| ❔     | Strings                                    | Already fully implemented?                                      |

## Control Structures

| Status | Feature                         | Comment                                                                                                          |
| ------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ✅     | Functions                       | User definable functions are inlined in compiled code                                                            |
| ✅     | Conditionals                    |                                                                                                                  |
| ✅     | Conditional Branching           |                                                                                                                  |
| 🕒     | `loop(counter, actions...)`     | We should have generic loops even if sample- and channel related iterations should be handled by `eachChannel()` |
| 🕒     | `while(actions..., condition)`  |                                                                                                                  |
| 🕒     | `while(condition) (actions...)` |                                                                                                                  |

## Operators

| Status | Feature                   | Comment                                         |
| ------ | ------------------------- | ----------------------------------------------- |
| ✅     | `!value`                  |                                                 |
| ✅     | `-value`                  |                                                 |
| ✅     | `+value`                  |                                                 |
| ✅     | `base ^ exponent`         | `Math.pow(base, exponent) or **`                |
| ✅     | `numerator % denominator` |                                                 |
| ✅     | `value / divisor`         |                                                 |
| ✅     | `value * another_value`   |                                                 |
| ✅     | `value - another_value`   |                                                 |
| ✅     | `value + another_value`   |                                                 |
| ❌     | `value1 == value2`        | Has a tolerance of 0.00001. We only allow `===` |
| ✅     | `value1 === value2`       |                                                 |
| ❌     | `value1 != value2`        | Has a tolerance of 0.00001. We only allow `===` |
| ✅     | `value1 !== value2`       |                                                 |
| ✅     | `value1 < value2`         |                                                 |
| ✅     | `value1 > value2`         |                                                 |
| ✅     | `value1 <= value2`        |                                                 |
| ✅     | `value1 >= value2`        |                                                 |
| ✅     | `y \|\| z`                |                                                 |
| ✅     | `y && z`                  |                                                 |
| ✅     | `y ? z`                   |                                                 |
| ✅     | `y ? z : x`               |                                                 |
| ✅     | `y = z`                   |                                                 |
| ✅     | `y *= z`                  |                                                 |
| ✅     | `y /= divisor`            |                                                 |
| ✅     | `y %= divisor`            |                                                 |
| 🕒     | `base ^= exponent`        | Should be implemented as JavaScript's `**=`     |
| ✅     | `y += z`                  |                                                 |
| ✅     | `y -= z`                  |                                                 |

## Bitwise operators

| Status | Feature              | Comment |
| ------ | -------------------- | ------- |
| 🕒     | `value << shift_amt` |         |
| 🕒     | `value >> shift_amt` |         |
| 🕒     | `a \| b`             |         |
| 🕒     | `a & b`              |         |
| 🕒     | `a ~ b`              |         |
| 🕒     | `y \| = z`           |         |
| 🕒     | `y &= z`             |         |
| 🕒     | `y ~= z`             |         |

## Math Functions

| Status | Feature       | Comment |
| ------ | ------------- | ------- |
| ✅     | `sin(angle)`  |         |
| ✅     | `cos(angle)`  |         |
| ✅     | `tan(angle)`  |         |
| ✅     | `asin(x)`     |         |
| ✅     | `acos(x)`     |         |
| ✅     | `atan(x)`     |         |
| ✅     | `atan2(x, y)` |         |
| ✅     | `sqr(x)`      |         |
| ✅     | `sqrt(x)`     |         |
| ✅     | `pow(x, y)`   |         |
| ✅     | `exp(x)`      |         |
| ✅     | `log(x)`      |         |
| ✅     | `log10(x)`    |         |
| ✅     | `abs(x)`      |         |
| ✅     | `min(x, y)`   |         |
| ✅     | `max(x, y)`   |         |
| ✅     | `sign(x)`     |         |
| ✅     | `rand(x)`     |         |
| ✅     | `floor(x)`    |         |
| ✅     | `ceil(x)`     |         |
| ✅     | `invsqrt(x)`  |         |

## Time Functions

| Status | Feature             | Comment |
| ------ | ------------------- | ------- |
| 🕒     | `time([v])`         |         |
| 🕒     | `time_precise([v])` |         |

## Midi Functions

| Status | Feature                                       | Comment |
| ------ | --------------------------------------------- | ------- |
| 🕒     | `midisend(offset, msg1, msg2)`                |         |
| 🕒     | `midisend(offset, msg1, msg2 + (msg3 * 256))` |         |
| 🕒     | `midisend(offset, msg1, msg2, msg3)`          |         |
| 🕒     | `midisend_buf(offset, buf, len)`              |         |
| 🕒     | `midisend_str(offset, string)`                |         |
| 🕒     | `midirecv(offset, msg1, msg23)`               |         |
| 🕒     | `midirecv(offset, msg1, msg2, msg3)`          |         |
| 🕒     | `midirecv_buf(offset, buf, maxlen)`           |         |
| 🕒     | `midirecv_str(offset, string)`                |         |
| 🕒     | `midisyx(offset, msgptr, len)`                |         |

## Memory/FFT/MDCT Functions

| Status | Feature                                    | Comment |
| ------ | ------------------------------------------ | ------- |
| 🕒     | `mdct(start_index, size)`                  |         |
| 🕒     | `imdct(start_index, size)`                 |         |
| 🕒     | `fft(start_index, size)`                   |         |
| 🕒     | `ifft(start_index, size)`                  |         |
| 🕒     | `fft_real(start_index, size)`              |         |
| 🕒     | `ifft_real(start_index, size)`             |         |
| 🕒     | `fft_permute(index, size)`                 |         |
| 🕒     | `fft_ipermute(index, size)`                |         |
| 🕒     | `convolve_c(dest, src, size)`              |         |
| 🕒     | `freembuf(top)`                            |         |
| 🕒     | `memcpy(dest, source, length)`             |         |
| 🕒     | `memset(dest, value, length)`              |         |
| 🕒     | `mem_multiply_sum(buf1, buf2, length)`     |         |
| 🕒     | `mem_insert_shuffle(buf, len, value)`      |         |
| 🕒     | `__memtop()`                               |         |
| 🕒     | `stack_push(value)`                        |         |
| 🕒     | `stack_pop(value)`                         |         |
| 🕒     | `stack_peek(index)`                        |         |
| 🕒     | `stack_exch(value)`                        |         |
| 🕒     | `atomic_setifequal(dest, value, newvalue)` |         |
| 🕒     | `atomic_exch(val1, val2)`                  |         |
| 🕒     | `atomic_add(dest_val1, val2)`              |         |
| 🕒     | `atomic_set(dest_val1, val2)`              |         |
| 🕒     | `atomic_get(val)`                          |         |

## Host Interaction Functions

| Status | Feature                                                                                                      | Comment |
| ------ | ------------------------------------------------------------------------------------------------------------ | ------- |
| 🕒     | `sliderchange(mask \| sliderX)`                                                                              |         |
| 🕒     | `slider_automate(mask or sliderX[, end_touch])`                                                              |         |
| 🕒     | `slider_show(mask or sliderX[, value]) `                                                                     |         |
| 🕒     | `export_buffer_to_project(buffer, length_samples, nch, srate, track_index[, flags, tempo, planar_pitch]) --` |         |
| 🕒     | `get_host_numchan()`                                                                                         |         |
| 🕒     | `set_host_numchan(numchan)`                                                                                  |         |
| 🕒     | `get_pin_mapping(inout, pin, startchan, chanmask)`                                                           |         |
| 🕒     | `set_pin_mapping(inout, pin, startchan, chanmask, mapping)`                                                  |         |
| 🕒     | `get_pinmapper_flags(no parameters)`                                                                         |         |
| 🕒     | `set_pinmapper_flags(flags)`                                                                                 |         |
| 🕒     | `get_host_placement([chain_pos, flags])`                                                                     |         |

## String Functions

| Status | Feature                                      | Comment |
| ------ | -------------------------------------------- | ------- |
| 🕒     | `strlen(str)`                                |         |
| 🕒     | `strcpy(str, srcstr)`                        |         |
| 🕒     | `strcat(str, srcstr)`                        |         |
| 🕒     | `strcmp(str, str2)`                          |         |
| 🕒     | `stricmp(str, str2)`                         |         |
| 🕒     | `strncmp(str, str2, maxlen)`                 |         |
| 🕒     | `strnicmp(str, str2, maxlen)`                |         |
| 🕒     | `strncpy(str, srcstr, maxlen)`               |         |
| 🕒     | `strncat(str, srcstr, maxlen)`               |         |
| 🕒     | `strcpy_from(str, srcstr, offset)`           |         |
| 🕒     | `strcpy_substr(str, srcstr, offset, maxlen)` |         |
| 🕒     | `str_getchar(str, offset[, type])`           |         |
| 🕒     | `str_setchar(str, offset, value[, type])`    |         |
| 🕒     | `strcpy_fromslider(str, slider)`             |         |
| 🕒     | `sprintf(str, format, ...)`                  |         |
| 🕒     | `match(needle, haystack, ...)`               |         |
| 🕒     | `matchi(needle, haystack, ...)`              |         |

## GFX Functions

| Status | Feature                                                                                                                           | Comment |
| ------ | --------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 🕒     | `gfx_set(r[g, b, a, mode, dest])`                                                                                                 |         |
| 🕒     | `gfx_lineto(x, y, aa)`                                                                                                            |         |
| 🕒     | `gfx_line(x, y, x2, y2[, aa])`                                                                                                    |         |
| 🕒     | `gfx_rectto(x, y)`                                                                                                                |         |
| 🕒     | `gfx_rect(x, y, w, h)`                                                                                                            |         |
| 🕒     | `gfx_setpixel(r, g, b)`                                                                                                           |         |
| 🕒     | `gfx_getpixel(r, g, b)`                                                                                                           |         |
| 🕒     | `gfx_drawnumber(n, ndigits)`                                                                                                      |         |
| 🕒     | `gfx_drawchar($'c')`                                                                                                              |         |
| 🕒     | `gfx_drawstr(str[, flags, right, bottom])`                                                                                        |         |
| 🕒     | `gfx_measurestr(str, w, h)`                                                                                                       |         |
| 🕒     | `gfx_setfont(idx[, fontface, sz, flags])`                                                                                         |         |
| 🕒     | `gfx_getfont()`                                                                                                                   |         |
| 🕒     | `gfx_printf(str, ...)`                                                                                                            |         |
| 🕒     | `gfx_blurto(x,y)`                                                                                                                 |         |
| 🕒     | `gfx_blit(source, scale, rotation)`                                                                                               |         |
| 🕒     | `gfx_blit(source, scale, rotation[, srcx, srcy, srcw, srch, destx, desty, destw, desth, rotxoffs, rotyoffs])`                     |         |
| 🕒     | `gfx_blitext(source, coordinatelist, rotation)`                                                                                   |         |
| 🕒     | `gfx_getimgdim(image, w, h)`                                                                                                      |         |
| 🕒     | `gfx_setimgdim(image, w,h)`                                                                                                       |         |
| 🕒     | `gfx_loadimg(image, filename)`                                                                                                    |         |
| 🕒     | `gfx_gradrect(x,y,w,h, r,g,b,a[, drdx, dgdx, dbdx, dadx, drdy, dgdy, dbdy, dady])`                                                |         |
| 🕒     | `gfx_muladdrect(x,y,w,h, mul_r, mul_g, mul_b[, mul_a, add_r, add_g, add_b, add_a])`                                               |         |
| 🕒     | `gfx_deltablit(srcimg,srcx,srcy,srcw,srch, destx, desty, destw, desth, dsdx, dtdx, dsdy, dtdy, dsdxdy, dtdxdy[, usecliprect=1] )` |         |
| 🕒     | `gfx_transformblit(srcimg, destx, desty, destw, desth, div_w, div_h, table)`                                                      |         |
| 🕒     | `gfx_circle(x,y,r[,fill,antialias])`                                                                                              |         |
| 🕒     | `gfx_roundrect(x,y,w,h,radius[,antialias])`                                                                                       |         |
| 🕒     | `gfx_arc(x,y,r, ang1, ang2[,antialias])`                                                                                          |         |
| 🕒     | `gfx_triangle(x1,y1,x2,y2,x3,y3[,x4,y4,...])`                                                                                     |         |
| 🕒     | `gfx_getchar([char, unicodechar])`                                                                                                |         |
| 🕒     | `gfx_showmenu("str")`                                                                                                             |         |
| 🕒     | `gfx_setcursor(resource_id[,"custom cursor name"])`                                                                               |         |

## GFX Vars

| Status | Feature                            | Comment |
| ------ | ---------------------------------- | ------- |
| 🕒     | `gfx_r`, `gfx_g`, `gfx_b`, `gfx_a` |         |
| 🕒     | `gfx_w`, `gfx_h`                   |         |
| 🕒     | `gfx_x`, `gfx_y`                   |         |
| 🕒     | `gfx_mode`                         |         |
| 🕒     | `gfx_clear`                        |         |
| 🕒     | `gfx_dest`                         |         |
| 🕒     | `gfx_texth`                        |         |
| 🕒     | `gfx_ext_retina`                   |         |
| 🕒     | `gfx_ext_flags`                    |         |
| 🕒     | `mouse_x`, `mouse_y`               |         |
| 🕒     | `mouse_cap`                        |         |
| 🕒     | `mouse_wheel`, `mouse_hwheel`      |         |

## Special Vars and Extended Functionality

| Status | Feature         | Comment |
| ------ | --------------- | ------- |
| 🕒     | `trigger`       |         |
| 🕒     | `ext_noinit`    |         |
| 🕒     | `ext_nodenorm`  |         |
| ✅     | `ext_tail_size` |         |
| 🕒     | `reg00-reg99`   |         |
| 🕒     | `_global.*`     |         |

## Delay Compensation Vars

| Status | Feature      | Comment |
| ------ | ------------ | ------- |
| 🕒     | `pdc_delay`  |         |
| 🕒     | `pdc_bot_ch` |         |
| 🕒     | `pdc_top_ch` |         |
| 🕒     | `pdc_midi`   |         |
