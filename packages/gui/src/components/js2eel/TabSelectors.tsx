import { useMemo } from 'preact/hooks';
import { useJs2EelStore } from '../../zustand/js2eelStore';
import { saveClientSetting } from '../../storage/clientSettings';
import { COLORS, tabs } from '../../constants';

import type { VNode } from 'preact';
import type { Js2EelLeftTab, Js2EelRightTab } from '../../types';
import { useAppStore } from '../../zustand/appStore';

type Props = {
    side: 'left' | 'right';
};

export const TabSelectors = ({ side }: Props): VNode => {
    const hasSeenHelp = useAppStore((state) => state.hasSeenHelp);
    const setHasSeenHelp = useAppStore((state) => state.setHasSeenHelp);
    const leftTab = useJs2EelStore((state) => state.leftTab);
    const setLeftTab = useJs2EelStore((state) => state.setLeftTab);
    const rightTab = useJs2EelStore((state) => state.rightTab);
    const setRightTab = useJs2EelStore((state) => state.setRightTab);

    const activeTab = side === 'left' ? leftTab : rightTab;

    const chosenTabs = useMemo(() => {
        if (side === 'left') {
            return tabs.js2eel.left;
        } else {
            return tabs.js2eel.right;
        }
    }, [side]);

    return (
        <div
            style={{
                background: COLORS.tabBarBg,
                display: 'flex',
                flex: '0 0 24px',
                borderBottom: `1px solid ${COLORS.border}`
                // boxShadow: `1px 1px 7px rgba(0, 0, 0, 0.1)`,
            }}
        >
            {chosenTabs.map((tab) => (
                <div
                    style={{
                        cursor: activeTab === tab.id ? 'default' : 'pointer',
                        background:
                            activeTab === tab.id ? COLORS.tabActiveBg : COLORS.tabInactiveBg,
                        // color: tab.id === 'docs' && !hasSeenHelp ? COLORS.error : 'inherit',
                        fontWeight: tab.id === 'docs' && !hasSeenHelp ? 'bold' : 'normal',
                        // borderLeft:
                        //     activeTab === tab.id
                        //         ? '1px solid transparent'
                        //         : `1px solid ${COLORS.tabDarkBorder}`,
                        borderRight:
                            // activeTab === tab.id
                            //     ? '1px solid transparent'
                            /*:*/ `1px solid ${COLORS.borderIntense}`,
                        animation:
                            tab.id === 'docs' && !hasSeenHelp ? 'glowing 1300ms infinite' : 'none',
                        // border: tab.id === 'docs' && !hasSeenHelp
                        //         ? 'red'
                        //         : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px 4px',
                        height: '24px',
                        fontSize: '9pt',
                        letterSpacing: '0.4px',
                        userSelect: 'none'
                    }}
                    key={tab.id}
                    onClick={async (): Promise<void> => {
                        if (side === 'left') {
                            setLeftTab(tab.id as Js2EelLeftTab);
                            saveClientSetting('currentLeftTab', tab.id);
                        } else {
                            if (tab.id === 'docs') {
                                saveClientSetting('hasSeenHelp', 'yes');
                                setHasSeenHelp(true);
                            }
                            setRightTab(tab.id as Js2EelRightTab);
                            saveClientSetting('currentRightTab', tab.id);
                        }
                    }}
                >
                    {tab.title}
                </div>
            ))}
        </div>
    );
};
