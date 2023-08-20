import { useJs2EelStore } from '../zustand/js2eelStore';
import { setEditorContent } from '../codemirror/editorContent';
import { saveClientSetting } from '../storage/clientSettings';
import { getFileNameFromFilePath } from '@js2eel/compiler';
import { useAppStore } from '../zustand/appStore';

export const activateFile = async (
    src: string,
    filePath: string,
    isExample: boolean
): Promise<void> => {
    const setCurrentSrc = useJs2EelStore.getState().setCurrentSrc;
    const setCurrentFile = useJs2EelStore.getState().setCurrentFile;
    const onCompile = useJs2EelStore.getState().onCompile;
    const setSaved = useJs2EelStore.getState().setSaved;
    const setCompileDuration = useJs2EelStore.getState().setCompileDuration;
    const setCompileResult = useJs2EelStore.getState().setCompileResult;
    const setExpandedTreeNodes = useAppStore.getState().setExpandedTreeNodes;
    const jsEditorRef = useJs2EelStore.getState().jsEditorRef;

    saveClientSetting('currentFilePath', filePath);

    setCurrentSrc(src);
    setCurrentFile({
        fileName: getFileNameFromFilePath(filePath),
        absoluteFilePath: filePath,
        isExample: isExample
    });

    if (onCompile) {
        const result = await onCompile(filePath, src);
        setSaved(true);

        if (result) {
            setCompileResult(result.result);
            setCompileDuration(result.compileTime);
        }
    }

    if (jsEditorRef.current) {
        setEditorContent(jsEditorRef.current, src);
    }
};
