import { createRef } from 'preact';
import { create } from 'zustand';

import type { MutableRef } from 'preact/hooks';
import type { EditorView } from 'codemirror';
import type { CompileResult } from '@js2eel/compiler/dist/types/js2eel/types';
import type { CurrentFile, Js2EelLeftTab, Js2EelRightTab, OnCompileFunction } from '../types';
import type { Js2EelStorage } from '../storage/Js2EelStorage';

interface Js2EelState {
    jsEditorRef: MutableRef<EditorView | null>;
    eelEditorRef: MutableRef<EditorView | null>;
    storage: Js2EelStorage | null;
    setStorage: (storage: Js2EelStorage) => void;
    onCompile: OnCompileFunction | null;
    setOnCompile: (onCompileFunction: OnCompileFunction) => void;
    compileResult: CompileResult | null;
    setCompileResult: (compileResult: CompileResult) => void;
    compileDuration: number | null;
    setCompileDuration: (duration: number) => void;
    currentFile: CurrentFile | null;
    setCurrentFile: (currentFile: CurrentFile) => void;
    leftTab: Js2EelLeftTab | null;
    setLeftTab: (leftTab: Js2EelLeftTab) => void;
    rightTab: Js2EelRightTab | null;
    setRightTab: (leftTab: Js2EelRightTab) => void;
    currentSrc: string;
    setCurrentSrc: (src: string) => void;
    saved: boolean;
    setSaved: (saved: boolean) => void;
    jsEditorInitialized: boolean;
    setJsEditorInitialized: () => void;
    takeCurrentFileAsTemplate: boolean;
    setTakeCurrentFileAsTemplate: (takeCurrentFileAsTemplate: boolean) => void;
}

export const useJs2EelStore = create<Js2EelState>((set) => ({
    jsEditorRef: createRef(),
    eelEditorRef: createRef(),
    storage: null,
    setStorage: (storage: Js2EelStorage): void => set(() => ({ storage: storage })),
    onCompile: null,
    setOnCompile: (onCompileFunction: OnCompileFunction): void =>
        set(() => ({
            onCompile: onCompileFunction
        })),
    compileResult: null,
    setCompileResult: (compileResult: CompileResult): void =>
        set(() => ({
            compileResult: compileResult
        })),
    compileDuration: null,
    setCompileDuration: (duration: number): void => set(() => ({ compileDuration: duration })),
    currentFile: null,
    setCurrentFile: (currentFile: CurrentFile): void =>
        set(() => ({
            currentFile: currentFile
        })),
    leftTab: null,
    setLeftTab: (leftTab: Js2EelLeftTab): void => set(() => ({ leftTab: leftTab })),
    rightTab: null,
    setRightTab: (rightTab: Js2EelRightTab): void => set(() => ({ rightTab: rightTab })),
    currentSrc: '',
    setCurrentSrc: (src: string): void => set(() => ({ currentSrc: src })),
    saved: true,
    setSaved: (saved: boolean): void => set(() => ({ saved: saved })),
    jsEditorInitialized: false,
    setJsEditorInitialized: (): void => set(() => ({ jsEditorInitialized: true })),
    takeCurrentFileAsTemplate: false,
    setTakeCurrentFileAsTemplate: (takeCurrentFileAsTemplate: boolean): void =>
        set(() => ({ takeCurrentFileAsTemplate: takeCurrentFileAsTemplate }))
}));
