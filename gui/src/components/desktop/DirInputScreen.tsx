import { useEffect, useState } from 'preact/hooks';
import { useAppStore } from '../../zustand/appStore';
import { useJs2EelStore } from '../../zustand/js2eelStore';
import { TitleDisplay } from './TitleDisplay';
import { Button } from '../ui/Button';
import { DirSelector } from './DirSelector';

import type { VNode } from 'preact';

export const DirInputScreen = (): VNode => {
    const [inputDir, setInputDir] = useState<string | null>(null);
    const [outputDir, setOutputDir] = useState<string | null>(null);
    const storage = useJs2EelStore((state) => state.storage);
    const settings = useAppStore((state) => state.desktopSettings);
    const setSettings = useAppStore((state) => state.setDesktopSettings);
    const setAppScreen = useAppStore((state) => state.setAppScreen);

    useEffect(() => {
        if (settings && outputDir === null) {
            setOutputDir(settings.reaperDefaultEffectsDir);
        }
    }, [settings, outputDir]);

    const onSave = async (): Promise<void> => {
        if (storage) {
            if (inputDir && outputDir) {
                const inputSuccess = await storage.saveDesktopSetting('inputDir', inputDir);
                const outputSuccess = await storage.saveDesktopSetting('outputDir', outputDir);

                if (inputSuccess && outputSuccess) {
                    const newSettings = await storage.loadDesktopSettings();

                    if (!newSettings) {
                        return;
                    }

                    setSettings(newSettings);

                    await setAppScreen('home');
                }
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <TitleDisplay />
            <div style={{ marginTop: 20 }}>
                <div>Please specify input and output directories.</div>
                <div>
                    <h2 style={{ fontSize: '13pt' }}>Input directory</h2>
                    <p>
                        This is where your JavaScript sourcecode lives.
                        <br />
                        You can put this directory under version control.
                    </p>
                </div>
                <DirSelector
                    dir={inputDir}
                    setDir={setInputDir}
                    onChoose={async (): Promise<void> => {
                        const value = await window.electronAPI.openDirectory(settings?.inputDir);

                        if (value) {
                            setInputDir(value);
                        }
                    }}
                />
                <div>
                    <h2 style={{ fontSize: '13pt' }}>Output directory</h2>
                    <p>
                        Your compiled <code>.jsfx</code> files get saved here.
                        <br />
                        Ideally you would choose somewhere inside of the
                        <code>Effects/</code> directory in REAPER&apos;s user directory.
                    </p>
                </div>
                <DirSelector
                    dir={outputDir}
                    setDir={setOutputDir}
                    onChoose={async (): Promise<void> => {
                        const value = await window.electronAPI.openDirectory(settings?.outputDir);

                        if (value) {
                            setOutputDir(value);
                        }
                    }}
                />
                <Button
                    additionalStyles={{ marginTop: '20px' }}
                    label="Save"
                    onClick={async (): Promise<void> => {
                        await onSave();
                    }}
                />
            </div>
        </div>
    );
};
