import icon from '../../../public/favicon.png';
import { COMPILER_VERSION } from '@js2eel/compiler';

import type { VNode } from 'preact';

export const TitleDisplay = (): VNode => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 12
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    style={{ width: 40, height: 40, marginRight: 16, marginBottom: 4 }}
                    src={icon}
                    alt="JS2EEL Logo"
                />
                <h1 style={{ marginBottom: 8 }}>JS2EEL</h1>
            </div>
            <div>v{COMPILER_VERSION}</div>
        </div>
    );
};
