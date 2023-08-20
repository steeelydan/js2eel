export declare global {
    interface Window {
        electronAPI: {
            apiJsFileList: () => Promise<string[] | null>;
            apiLoadSettings: () => Promise<Settings | null>;
            apiSaveSetting: (body: { key: keyof Settings; value: string }) => Promise<boolean>;
            apiLoadJsSrc: (fileName: string) => Promise<string | null>;
            apiSaveJsSrc: (fileName: string, content: string) => Promise<boolean>;
            apiJsCompile: (
                filePath: string,
                jsSrc: string
            ) => Promise<CompileResult | { success: false }>;
            openDirectory: () => Promise<string | null>;
            showDirInFileBrowser: (dirPath: string) => Promise<void>;
        };
    }
}
