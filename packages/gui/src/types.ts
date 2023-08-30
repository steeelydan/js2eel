import type { CompileResult } from '@js2eel/compiler/dist/types/js2eel/types';
import type { HELP_PAGE_TITLES } from './constants';

export type SampleProcessorMessage = {
    param: string;
    value: number;
};

export type JSONData = Record<string, unknown>;

export type Js2EelLeftTab = 'jsCode' | 'jsAst' | 'pluginData';
export type Js2EelRightTab = 'eelCode' | 'docs';

export type AppEnvironment = 'desktop' | 'webapp';

export type ListedFile = { absoluteFilePath: string };

export type AppScreen = 'home' | 'dirinput' | 'settings' | 'js2eel';

export type FileCurrentExpandedTreeNodes = Record<string, boolean> | null;
export type CurrentExpandedTreeNodes = { [filePath in string]?: FileCurrentExpandedTreeNodes };
export type FileCurrentTabView = Record<string, 'raw' | 'tree'>;
export type CurrentTabView = { [filePath in string]?: FileCurrentTabView };
export type FileScrollPositions = Record<string, number>;
export type ScrollPositions = { [filePath in string]?: FileScrollPositions };

export type ClientSettings = {
    currentFilePath: string;
    dark: boolean;
    screen: AppScreen;
    hasSeenHelp: 'yes' | undefined;
    currentLeftTab: Js2EelLeftTab;
    currentRightTab: Js2EelRightTab;
    currentHelpPath: keyof typeof HELP_PAGE_TITLES;
    currentExpandedTreeNodes: CurrentExpandedTreeNodes;
    currentTabView: CurrentTabView;
    scrollPositions: ScrollPositions;
};

export type CurrentFile = {
    fileName: string;
    absoluteFilePath: string;
    isExample: boolean;
};

export type WrappedCompileResult = {
    result: CompileResult;
    compileTime: number;
};

export type OnCompileFunction = (
    filePath: string,
    jsSrc: string
) => Promise<WrappedCompileResult | null>;

export type ModalName = 'openFile' | 'newFile';

export type LocalStorageSavedFile = {
    src: string;
    modified: string;
};
