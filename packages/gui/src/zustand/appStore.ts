import { create } from 'zustand';
import type { AppEnvironment, AppScreen, ModalName } from '../types';
import { saveClientSetting } from '../storage/clientSettings';
import type { DesktopSettings } from '@js2eel/compiler/dist/types/js2eel/types';

interface AppState {
    environment: AppEnvironment | null;
    setEnvironment: (environment: AppEnvironment) => void;
    dark: boolean | null;
    setDark: (dark: boolean) => void;
    appScreen: AppScreen | null;
    setAppScreen: (screen: AppScreen) => Promise<void>;
    desktopSettings: DesktopSettings | null;
    setDesktopSettings: (newDesktopSettings: DesktopSettings) => void;
    modalOpen: ModalName | null;
    setModalOpen: (modal: ModalName | null) => void;
    hasSeenHelp: boolean;
    setHasSeenHelp: (hasSeenIt: boolean) => void;
    expandedTreeNodes: null | Record<string, boolean>;
    setExpandedTreeNodes: (newExpandedTreeNodes: Record<string, boolean> | null) => void;
    expandTreeNode: (nodeId: string) => void;
    collapseTreeNode: (nodeId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    environment: null,
    setEnvironment: (environment: AppEnvironment): void =>
        set(() => ({
            environment: environment
        })),
    dark: null,
    setDark: (dark: boolean): void => {
        set(() => ({ dark: dark }));
    },
    appScreen: null,
    setAppScreen: async (screen: AppScreen): Promise<void> => {
        set(() => ({ appScreen: screen }));
        saveClientSetting('screen', screen);
    },
    desktopSettings: null,
    setDesktopSettings: (newSettings: DesktopSettings): void => {
        set(() => ({ desktopSettings: newSettings }));
    },
    modalOpen: null,
    setModalOpen: (modalName: ModalName | null): void => {
        set(() => ({ modalOpen: modalName }));
    },
    hasSeenHelp: true,
    setHasSeenHelp: (hasSeenIt: boolean): void => {
        set(() => ({ hasSeenHelp: hasSeenIt }));
    },
    expandedTreeNodes: null,
    setExpandedTreeNodes: (newExpandedTreeNodes: Record<string, boolean> | null): void => {
        set(() => ({ expandedTreeNodes: newExpandedTreeNodes }));
    },
    expandTreeNode: (nodeId: string): void => {
        set((state): AppState => {
            if (state.expandedTreeNodes) {
                state.expandedTreeNodes[nodeId] = true;
            }

            return state;
        });
    },
    collapseTreeNode: (nodeId: string): void => {
        set((state): AppState => {
            if (state.expandedTreeNodes) {
                delete state.expandedTreeNodes[nodeId];
            }
            return state;
        });
    }
}));
