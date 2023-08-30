import { useEffect, useState } from 'preact/hooks';
import { Home } from 'react-feather';
import { useAppStore } from '../../zustand/appStore';
import { useJs2EelStore } from '../../zustand/js2eelStore';
import { ToolbarFrame } from '../layout/ToolbarFrame';
import { Button } from '../ui/Button';
import { DirSelector } from './DirSelector';

import type { VNode } from 'preact';

export const DesktopSettings = (): VNode => {
    const [inputDir, setInputDir] = useState<string | null>(null);
    const [outputDir, setOutputDir] = useState<string | null>(null);
    const storage = useJs2EelStore((state) => state.storage);
    const settings = useAppStore((state) => state.desktopSettings);
    const setSettings = useAppStore((state) => state.setDesktopSettings);
    const setAppScreen = useAppStore((state) => state.setAppScreen);

    useEffect(() => {
        if (settings) {
            setInputDir(settings.inputDir || null);
            setOutputDir(settings.outputDir || null);
        }
    }, [settings]);

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
        <div>
            <ToolbarFrame>
                <div style={{ display: 'flex', flex: '0 0 50%' }}>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Button
                                title="Home"
                                icon={<Home size={14} />}
                                onClick={async (): Promise<void> => {
                                    await setAppScreen('home');
                                }}
                                additionalStyles={{ marginRight: '12px' }}
                            />
                        </div>
                    </div>
                </div>
            </ToolbarFrame>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <h1>Settings</h1>
                <div style={{ marginTop: 20 }}>
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
                            const value = await window.electronAPI.openDirectory(
                                settings?.inputDir
                            );

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
                            const value = await window.electronAPI.openDirectory(
                                settings?.outputDir
                            );

                            if (value) {
                                setOutputDir(value);
                            }
                        }}
                    />
                    <div style={{ display: 'flex', marginTop: '32px' }}>
                        <Button
                            label="Cancel"
                            variant="buttonSecondary"
                            additionalStyles={{ marginRight: '12px' }}
                            onClick={async (): Promise<void> => {
                                await setAppScreen('home');
                            }}
                        />
                        <Button
                            label="Save"
                            onClick={async (): Promise<void> => {
                                await onSave();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
