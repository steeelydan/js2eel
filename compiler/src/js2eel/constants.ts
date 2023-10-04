// General constants

export const COMPILER_VERSION = 'TO_BE_REPLACED_COMPILER_VERSION';

export const EEL_MAX_SYMBOL_NAME_LENGTH = 127;
export const EEL_SYMBOL_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

// Library objects

const MATH_OBJECTS = ['Math'];
const DEBUG_OBJECTS = ['console'];

export const JS2EEL_LIBRARY_OBJECT_NAMES = new Set([...MATH_OBJECTS, ...DEBUG_OBJECTS]);
export const JS2EEL_LIBRARY_FUNCTION_NAMES = new Set([
    'config',
    'slider',
    'selectBox',
    'onInit',
    'onSlider',
    'onSample',
    'onBlock',
    'onGfx',
    'eachChannel'
]);

// Library Functions

const EEL_ACCESSOR_FUNCTIONS = ['spl', 'slider'];

const EEL_MATH_FUNCTIONS = [
    'sin',
    'cos',
    'tan',
    'asin',
    'acos',
    'atan',
    'atan2',
    'sqr',
    'sqrt',
    'pow',
    'exp',
    'log',
    'log10',
    'abs',
    'min',
    'max',
    'sign',
    'rand',
    'floor',
    'ceil',
    'invsqrt'
];

const EEL_CONTROL_FLOW_FUNCTIONS = ['loop', 'while'];

const EEL_TIME_FUNCTIONS = ['time', 'time_precise'];

const EEL_MIDI_FUNCTIONS = [
    'midisend',
    'midisend_buf',
    'midisend_str',
    'midirecv',
    'midirecv_buf',
    'midirecv_str',
    'midisyx'
];

const EEL_FILE_FUNCTIONS = [
    'file_open',
    'file_close',
    'file_rewind',
    'file_var',
    'file_mem',
    'file_avail',
    'file_riff',
    'file_text',
    'file_string'
];

const EEL_MEMORY_FFT_MDCT_FUNCTIONS = [
    'mdct',
    'imdct',
    'fft',
    'ifft',
    'fft_real',
    'ifft_real',
    'fft_permute',
    'fft_ipermute',
    'convolve_c',
    'freembuf',
    'memcpy',
    'memset',
    'mem_multiply_sum',
    'mem_insert_shuffle',
    '__memtop',
    'stack_push',
    'stack_pop',
    'stack_peek',
    'stack_exch',
    'atomic_setifequal',
    'atomic_exch',
    'atomic_add',
    'atomic_set',
    'atomic_get'
];

const EEL_HOST_INTERACTION_FUNCTIONS = [
    'sliderchange',
    'slider_automate',
    'slider_show',
    'export_buffer_to_project',
    'get_host_numchan',
    'set_host_numchan',
    'get_pin_mapping',
    'set_pin_mapping',
    'get_pinmapper_flags',
    'set_pinmapper_flags',
    'get_host_placement'
];

const EEL_STRING_FUNCTIONS = [
    'strlen',
    'strcpy',
    'strcat',
    'strcmp',
    'stricmp',
    'strncmp',
    'strnicmp',
    'strncpy',
    'strncat',
    'strcpy_from',
    'strcpy_substr',
    'str_getchar',
    'str_setchar',
    'strcpy_fromslider',
    'sprintf',
    'match',
    'matchi'
];

const EEL_GRAPHICS_FUNCTIONS = [
    'gfx_set',
    'gfx_lineto',
    'gfx_line',
    'gfx_rectto',
    'gfx_rect',
    'gfx_setpixel',
    'gfx_getpixel',
    'gfx_drawnumber',
    'gfx_drawchar',
    'gfx_drawstr',
    'gfx_measurestr',
    'gfx_setfont',
    'gfx_getfont',
    'gfx_printf',
    'gfx_blurto',
    'gfx_blit',
    'gfx_blitext',
    'gfx_getimgdim',
    'gfx_setimgdim',
    'gfx_loadimg',
    'gfx_gradrect',
    'gfx_muladdrect',
    'gfx_deltablit',
    'gfx_transformblit',
    'gfx_circle',
    'gfx_roundrect',
    'gfx_arc',
    'gfx_triangle',
    'gfx_getchar',
    'gfx_showmenu',
    'gfx_setcursor'
];

export const EEL_LIBRARY_FUNCTION_NAMES = new Set([
    ...EEL_ACCESSOR_FUNCTIONS,
    ...EEL_MATH_FUNCTIONS,
    ...EEL_CONTROL_FLOW_FUNCTIONS,
    ...EEL_TIME_FUNCTIONS,
    ...EEL_MIDI_FUNCTIONS,
    ...EEL_FILE_FUNCTIONS,
    ...EEL_MEMORY_FFT_MDCT_FUNCTIONS,
    ...EEL_HOST_INTERACTION_FUNCTIONS,
    ...EEL_STRING_FUNCTIONS,
    ...EEL_GRAPHICS_FUNCTIONS
]);

// Library Variables

const EEL_SAMPLE_VARS = [
    'spl0',
    'spl1',
    'spl2',
    'spl3',
    'spl4',
    'spl5',
    'spl6',
    'spl7',
    'spl8',
    'spl9',
    'spl10',
    'spl11',
    'spl12',
    'spl13',
    'spl14',
    'spl15',
    'spl16',
    'spl17',
    'spl18',
    'spl19',
    'spl20',
    'spl21',
    'spl22',
    'spl23',
    'spl24',
    'spl25',
    'spl26',
    'spl27',
    'spl28',
    'spl29',
    'spl30',
    'spl31',
    'spl32',
    'spl33',
    'spl34',
    'spl35',
    'spl36',
    'spl37',
    'spl38',
    'spl39',
    'spl40',
    'spl41',
    'spl42',
    'spl43',
    'spl44',
    'spl45',
    'spl46',
    'spl47',
    'spl48',
    'spl49',
    'spl50',
    'spl51',
    'spl52',
    'spl53',
    'spl54',
    'spl55',
    'spl56',
    'spl57',
    'spl58',
    'spl59',
    'spl60',
    'spl61',
    'spl62',
    'spl63'
];

const EEL_SLIDER_VARS = [
    'slider0',
    'slider1',
    'slider2',
    'slider3',
    'slider4',
    'slider5',
    'slider6',
    'slider7',
    'slider8',
    'slider9',
    'slider10',
    'slider11',
    'slider12',
    'slider13',
    'slider14',
    'slider15',
    'slider16',
    'slider17',
    'slider18',
    'slider19',
    'slider20',
    'slider21',
    'slider22',
    'slider23',
    'slider24',
    'slider25',
    'slider26',
    'slider27',
    'slider28',
    'slider29',
    'slider30',
    'slider31',
    'slider32',
    'slider33',
    'slider34',
    'slider35',
    'slider36',
    'slider37',
    'slider38',
    'slider39',
    'slider40',
    'slider41',
    'slider42',
    'slider43',
    'slider44',
    'slider45',
    'slider46',
    'slider47',
    'slider48',
    'slider49',
    'slider50',
    'slider51',
    'slider52',
    'slider53',
    'slider54',
    'slider55',
    'slider56',
    'slider57',
    'slider58',
    'slider59',
    'slider60',
    'slider61',
    'slider62',
    'slider63'
];

const EEL_REG_VARS = [
    'reg00',
    'reg01',
    'reg02',
    'reg03',
    'reg04',
    'reg05',
    'reg06',
    'reg07',
    'reg08',
    'reg09',
    'reg10',
    'reg11',
    'reg12',
    'reg13',
    'reg14',
    'reg15',
    'reg16',
    'reg17',
    'reg18',
    'reg19',
    'reg20',
    'reg21',
    'reg22',
    'reg23',
    'reg24',
    'reg25',
    'reg26',
    'reg27',
    'reg28',
    'reg29',
    'reg30',
    'reg31',
    'reg32',
    'reg33',
    'reg34',
    'reg35',
    'reg36',
    'reg37',
    'reg38',
    'reg39',
    'reg40',
    'reg41',
    'reg42',
    'reg43',
    'reg44',
    'reg45',
    'reg46',
    'reg47',
    'reg48',
    'reg49',
    'reg50',
    'reg51',
    'reg52',
    'reg53',
    'reg54',
    'reg55',
    'reg56',
    'reg57',
    'reg58',
    'reg59',
    'reg60',
    'reg61',
    'reg62',
    'reg63',
    'reg64',
    'reg65',
    'reg66',
    'reg67',
    'reg68',
    'reg69',
    'reg70',
    'reg71',
    'reg72',
    'reg73',
    'reg74',
    'reg75',
    'reg76',
    'reg77',
    'reg78',
    'reg79',
    'reg80',
    'reg81',
    'reg82',
    'reg83',
    'reg84',
    'reg85',
    'reg86',
    'reg87',
    'reg88',
    'reg89',
    'reg90',
    'reg91',
    'reg92',
    'reg93',
    'reg94',
    'reg95',
    'reg96',
    'reg97',
    'reg98',
    'reg99'
];

const EEL_MATH_VARS = ['$pi', '$phi', '$e'];

const EEL_GRAPHICS_VARS = [
    'gfx_r',
    'gfx_g',
    'gfx_b',
    'gfx_a',
    'gfx_w',
    'gfx_h',
    'gfx_x',
    'gfx_y',
    'gfx_mode',
    'gfx_clear',
    'gfx_dest',
    'gfx_texth',
    'gfx_ext_retina',
    'gfx_ext_flags',
    'mouse_x',
    'mouse_y',
    'mouse_cap',
    'mouse_wheel',
    'mouse_hwheel'
];

const EEL_MIDI_VARS = ['ext_midi_bus', 'midi_bus'];

const EEL_AUDIO_TRANSPORT_VARS = [
    'srate',
    'num_ch',
    'samplesblock',
    'tempo',
    'play_state',
    'play_position',
    'beat_position',
    'ts_num',
    'ts_denom'
];

const EEL_SPECIAL_VARS = [
    'trigger',
    'ext_noinit',
    'ext_nodenorm',
    'ext_tail_size',
    ...EEL_REG_VARS
];

const EEL_PDC_VARS = ['pdc_delay', 'pdc_bot_ch', 'pdc_top_ch', 'pdc_midi'];

export const EEL_LIBRARY_VARS = new Set([
    ...EEL_SAMPLE_VARS,
    ...EEL_SLIDER_VARS,
    ...EEL_MATH_VARS,
    ...EEL_GRAPHICS_VARS,
    ...EEL_MIDI_VARS,
    ...EEL_AUDIO_TRANSPORT_VARS,
    ...EEL_PDC_VARS,
    ...EEL_SPECIAL_VARS
]);

export const ALL_RESERVED_SYMBOL_NAMES = new Set([
    ...JS2EEL_LIBRARY_OBJECT_NAMES,
    ...JS2EEL_LIBRARY_FUNCTION_NAMES,
    ...EEL_LIBRARY_FUNCTION_NAMES,
    ...EEL_LIBRARY_VARS
]);

export const ALLOWED_Unary_OPERATORS = new Set(['!', '-', '+']);

export const ALLOWED_BINARY_OPERATORS = new Set([
    '%',
    '/',
    '*',
    '-',
    '+',
    '===',
    '!==',
    '<',
    '>',
    '<=',
    '>=',
    '**' /* ^ in EEL */
]);
// Differences to JSFX docs: https://www.reaper.fm/sdk/js/basiccode.php#js_ops
// Not yet supported EEL binary operators: <<, >>, |, &, ~
// Don't allow ^ (xor) because it's different in EEL (exp). Instead, ** is allowed.
// Don't allow == (equal if diff. less than 0.00001) and != (not equal if diff. less than 0.00001)
// ? and ? : are handled by ConditionalExpression
// ^= not allowed because it's different in EEL (exp)
// || and && are logical operators. Eel supports the same logical operators as JS, "&&" and "||"
// Not yet supported EEL binary assignment operators: |=, &=, ~=

export const ALLOWED_ASSIGNMENT_OPERATORS = new Set(['=', '*=', '%=', '+=', '-=']);
