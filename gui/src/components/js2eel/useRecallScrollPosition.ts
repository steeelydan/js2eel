import type { MutableRef } from 'preact/hooks';
import { useEffect, useRef, useState } from 'preact/hooks';
import { loadScrollPosition, saveScrollPosition } from '../../storage/persistedViewState';
import { useJs2EelStore } from '../../zustand/js2eelStore';

export const useRecallScrollPosition = (
    scrollElementRef: MutableRef<HTMLElement | null>,
    scrollElementId: string | undefined
): void => {
    const currentScrollPosRef = useRef<number>(0);
    const [mounted, setMounted] = useState<boolean>(false);
    const currentFilePath = useJs2EelStore((state) => state.currentFile)?.absoluteFilePath;

    useEffect(() => {
        const timer = setInterval(() => {
            if (scrollElementRef.current && scrollElementId) {
                setMounted(true);
                clearInterval(timer);
            }
        }, 250);

        return (): void => {
            clearInterval(timer);
        };
    }, [scrollElementId, scrollElementRef]);

    // Load old position
    useEffect(() => {
        if (mounted && scrollElementId && scrollElementRef.current && currentFilePath) {
            const getPrevScrollPosition = async (): Promise<void> => {
                const potentialSavedScrollPosition = await loadScrollPosition(
                    currentFilePath,
                    scrollElementId
                );

                if (scrollElementRef.current) {
                    if (
                        potentialSavedScrollPosition &&
                        scrollElementRef.current.scrollHeight > potentialSavedScrollPosition
                    ) {
                        scrollElementRef.current.scrollTop = potentialSavedScrollPosition;
                    } else {
                        await saveScrollPosition(currentFilePath, scrollElementId, 0);
                    }
                }
            };

            getPrevScrollPosition();
        }
    }, [mounted, scrollElementId, scrollElementRef, currentFilePath]);

    // Save scroll positions
    useEffect(() => {
        if (mounted && scrollElementId && scrollElementRef.current && currentFilePath) {
            const scrollInterval = setInterval(async () => {
                if (scrollElementRef.current) {
                    const currentScrollPos = scrollElementRef.current.scrollTop || 0;

                    if (currentScrollPosRef.current !== currentScrollPos) {
                        currentScrollPosRef.current = scrollElementRef.current.scrollTop || 0;

                        await saveScrollPosition(
                            currentFilePath,
                            scrollElementId,
                            scrollElementRef.current.scrollTop || 0
                        );
                    }
                }
            }, 500);

            return (): void => {
                clearInterval(scrollInterval);
            };
        }

        return;
    }, [mounted, scrollElementId, scrollElementRef, currentFilePath]);
};
