import { EXAMPLE_VOLUME_JS } from './components/js2eel/examples/01_volume';
import { EXAMPLE_SINEWAVE_JS } from './components/js2eel/examples/02_sinewave';
import { EXAMPLE_MONO_DELAY_JS } from './components/js2eel/examples/03_mono_delay';
import { EXAMPLE_STEREO_DELAY_JS } from './components/js2eel/examples/04_stereo_delay';
import { EXAMPLE_LOWPASS_JS } from './components/js2eel/examples/05_lowpass';
import { EXAMPLE_SATURATION_JS } from './components/js2eel/examples/06_saturation';
import { EXAMPLE_4BAND_EQ_JS } from './components/js2eel/examples/07_4band_eq';
import { EXAMPLE_CAB_SIM } from './components/js2eel/examples/08_cab_sim';

import type { Js2EelLeftTab, Js2EelRightTab } from './types';

export const tabs: {
    js2eel: {
        left: { id: Js2EelLeftTab; title: string }[];
        right: { id: Js2EelRightTab; title: string }[];
    };
} = {
    js2eel: {
        left: [
            { id: 'jsCode', title: 'JS Code' },
            { id: 'jsAst', title: 'JS AST' },
            { id: 'pluginData', title: 'Plugin Data' }
        ],
        right: [
            { id: 'eelCode', title: 'JSFX Code' },
            { id: 'docs', title: 'Docs' }
        ]
    }
};

export const examples = [
    EXAMPLE_VOLUME_JS,
    EXAMPLE_SINEWAVE_JS,
    EXAMPLE_MONO_DELAY_JS,
    EXAMPLE_STEREO_DELAY_JS,
    EXAMPLE_LOWPASS_JS,
    EXAMPLE_SATURATION_JS,
    EXAMPLE_4BAND_EQ_JS,
    EXAMPLE_CAB_SIM
];

export const COLORS = {
    textLight: '#1e1e1e',
    textDark: 'white',
    bgLight: 'white',
    bgDark: '#1e1e1e',
    border: '#eee',
    borderIntense: '#ccc',
    tileButtonBorder: '#5e5e5e',
    success: 'green',
    error: '#d11',
    warning: 'orange',
    buttonColor: 'white',
    buttonBg: '#0074e8',
    buttonBgSecondary: '#999',
    buttonBgHover: '#0084f8',
    buttonBgHoverSecondary: '#aaa',
    buttonBgDisabled: 'rgb(231, 231, 231)',
    iconButtonBgHover: 'rgb(231, 231, 231)',
    iconButtonBgSecondaryHover: 'rgb(231, 231, 231)',
    tabBarBg: '#f8f8f8',
    tabActiveBg: 'white',
    tabInactiveBg: '#ececec',
    link: '#0074e8',
    linkHover: '#0084f8'
};

export const HELP_PAGE_TITLES = {
    contents: 'Contents',
    'contents/getting-started': 'Getting Started',
    'contents/shortcuts': 'Keyboard Shortcuts',
    'contents/api-documentation': 'API Documentation',
    'contents/limitations': 'Limitations',
    'contents/feature-comparison': 'Feature Comparison with JSFX',
    'contents/development': 'Development',
    'contents/changelog': 'Changelog',
    'contents/useful-resources': 'Useful Resources'
};
