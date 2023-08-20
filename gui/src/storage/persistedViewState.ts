import { loadClientSetting, saveClientSetting } from './clientSettings';

import type {
    CurrentExpandedTreeNodes,
    CurrentTabView,
    FileCurrentExpandedTreeNodes,
    FileCurrentTabView,
    FileScrollPositions,
    ScrollPositions
} from '../types';

export const saveCurrentTabView = async (
    currentFilePath: string,
    newRaw: boolean,
    dataId: string
): Promise<void> => {
    let newTabView: CurrentTabView = {};
    const potentialCurrentTabView = await loadClientSetting('currentTabView');

    let fileCurrentTabView: FileCurrentTabView = {};

    if (potentialCurrentTabView) {
        newTabView = JSON.parse(potentialCurrentTabView);

        if (!newTabView) {
            newTabView = {};
        }

        const fileTabView = newTabView[currentFilePath];

        if (fileTabView) {
            fileCurrentTabView = fileTabView;
        }
    }

    if (newRaw) {
        fileCurrentTabView[dataId] = 'raw';
    } else {
        fileCurrentTabView[dataId] = 'tree';
    }

    newTabView[currentFilePath] = fileCurrentTabView;

    await saveClientSetting('currentTabView', JSON.stringify(newTabView));
};

export const loadCurrentTabView = async (
    currentFilePath: string,
    dataId: string
): Promise<'tree' | 'raw'> => {
    const potentialCurrentTabView: string | null = await loadClientSetting('currentTabView');

    if (potentialCurrentTabView && currentFilePath) {
        const currentTabView = JSON.parse(potentialCurrentTabView);
        if (currentTabView[currentFilePath] && currentTabView[currentFilePath][dataId] === 'raw') {
            return 'raw';
        } else {
            return 'tree';
        }
    } else {
        return 'raw';
    }
};

export const saveScrollPosition = async (
    currentFilePath: string,
    elementId: string,
    scrollPosition: number
): Promise<void> => {
    const potentialOldScrollPositions = await loadClientSetting('scrollPositions');

    let newScrollPositions: ScrollPositions = {};
    let newFileScrollPositions: FileScrollPositions = {};

    if (potentialOldScrollPositions) {
        newScrollPositions = JSON.parse(potentialOldScrollPositions);

        newFileScrollPositions = newScrollPositions[currentFilePath] || {};

        newFileScrollPositions = { ...newFileScrollPositions, [elementId]: scrollPosition };
    } else {
        newFileScrollPositions = { [elementId]: scrollPosition };
    }

    newScrollPositions[currentFilePath] = newFileScrollPositions;

    saveClientSetting('scrollPositions', JSON.stringify(newScrollPositions));
};

export const loadScrollPosition = async (
    currentFilePath: string,
    elementId: string
): Promise<number | null> => {
    const potentialOldScrollPositions = await loadClientSetting('scrollPositions');

    if (potentialOldScrollPositions) {
        const oldScrollPositions = JSON.parse(potentialOldScrollPositions);

        let fileScrollPositions: FileScrollPositions | null = null;

        if (oldScrollPositions) {
            fileScrollPositions = oldScrollPositions[currentFilePath];
        }

        return fileScrollPositions ? fileScrollPositions[elementId] : null;
    }

    return null;
};

export const loadExpandedTreeNodes = async (
    filePath: string
): Promise<FileCurrentExpandedTreeNodes | null> => {
    const potentialExpandedTreeNodesRaw = await loadClientSetting('currentExpandedTreeNodes');

    if (potentialExpandedTreeNodesRaw) {
        const potentialExpandedTreeNodes = JSON.parse(potentialExpandedTreeNodesRaw);
        let fileExpandedTreeNodes: FileCurrentExpandedTreeNodes | null = null;
        if (potentialExpandedTreeNodes) {
            fileExpandedTreeNodes = potentialExpandedTreeNodes[filePath];

            return fileExpandedTreeNodes;
        }
    }

    return null;
};

export const saveExpandedTreeNodes = async (
    filePath: string,
    expandedTreeNodes: FileCurrentExpandedTreeNodes | null
): Promise<void> => {
    const potentialExpandedTreeNodesRaw = await loadClientSetting('currentExpandedTreeNodes');

    let newExpandedTreeNodes: CurrentExpandedTreeNodes = {};
    let newFileExpandedTreeNodes: FileCurrentExpandedTreeNodes = {};

    if (potentialExpandedTreeNodesRaw) {
        newExpandedTreeNodes = JSON.parse(potentialExpandedTreeNodesRaw);

        let oldFileExpandedTreeNodes: FileCurrentExpandedTreeNodes | null = null;

        if (newExpandedTreeNodes) {
            oldFileExpandedTreeNodes = newExpandedTreeNodes[filePath] || null;
        }

        if (newExpandedTreeNodes && oldFileExpandedTreeNodes) {
            newFileExpandedTreeNodes = oldFileExpandedTreeNodes;
        }
    }

    newFileExpandedTreeNodes = expandedTreeNodes;

    newExpandedTreeNodes[filePath] = newFileExpandedTreeNodes;

    await saveClientSetting('currentExpandedTreeNodes', JSON.stringify(newExpandedTreeNodes));
};
