import { Edit3 } from 'react-feather';
import { TileButton } from './TileButton';

import type { VNode } from 'preact';
import { useAppStore } from '../../zustand/appStore';

import { useEffect } from 'preact/hooks';
import { useJs2EelStore } from '../../zustand/js2eelStore';
import { TitleDisplay } from './TitleDisplay';
import { Button } from '../ui/Button';

export const DesktopHome = (): VNode => {
    const setAppScreen = useAppStore((state) => state.setAppScreen);
    const storage = useJs2EelStore((state) => state.storage);
    const settings = useAppStore((state) => state.desktopSettings);
    const setSettings = useAppStore((state) => state.setDesktopSettings);

    useEffect(() => {
        if (storage && !settings) {
            const fetchSettings = async (): Promise<void> => {
                const savedSettings = await storage.loadDesktopSettings();

                if (savedSettings) {
                    setSettings(savedSettings);
                }
            };

            fetchSettings();
        }
    }, [settings, storage, setSettings]);

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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <TitleDisplay />
                <div style={{ display: 'flex' }}>
                    <TileButton
                        icon={<Edit3 />}
                        label="Editor"
                        onClick={async (): Promise<void> => await setAppScreen('js2eel')}
                    />
                    {/* <TileButton
                        icon={<Settings />}
                        label="Settings"
                        onClick={(): void => undefined}
                    /> */}
                </div>
                {settings && (
                    <div style={{ marginTop: 20, width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', marginBottom: 8 }}>
                            <div style={{ minWidth: 150 }}>Local app directory:&nbsp;</div>
                            <Button
                                variant="link"
                                onClick={async (): Promise<void> => {
                                    if (settings.appDir) {
                                        await window.electronAPI.showDirInFileBrowser(
                                            settings.appDir
                                        );
                                    }
                                }}
                                label={settings.appDir ? settings.appDir : ''}
                            />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 8 }}>
                            <div style={{ minWidth: 150 }}>Input directory:&nbsp;</div>
                            <Button
                                variant="link"
                                onClick={async (): Promise<void> => {
                                    if (settings.inputDir) {
                                        await window.electronAPI.showDirInFileBrowser(
                                            settings.inputDir
                                        );
                                    }
                                }}
                                label={settings.inputDir ? settings.inputDir : ''}
                            />
                        </div>
                        <div style={{ display: 'flex', marginBottom: 8 }}>
                            <div style={{ minWidth: 150 }}>Output directory:&nbsp;</div>
                            <Button
                                variant="link"
                                additionalStyles={{ justifyContent: 'flex-start' }}
                                onClick={async (): Promise<void> => {
                                    if (settings.outputDir) {
                                        await window.electronAPI.showDirInFileBrowser(
                                            settings.outputDir
                                        );
                                    }
                                }}
                                label={settings.outputDir ? settings.outputDir : ''}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
