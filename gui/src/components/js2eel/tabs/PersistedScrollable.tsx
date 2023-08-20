import type { VNode } from 'preact';
import { useRef } from 'preact/hooks';
import { useRecallScrollPosition } from '../useRecallScrollPosition';

type Props = {
    scrollableId: string;
    children: VNode | VNode[];
};

export const PersistedScrollable = ({ scrollableId, children }: Props): VNode => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useRecallScrollPosition(scrollContainerRef, scrollableId);

    return (
        <div
            ref={scrollContainerRef}
            style={{ overflow: 'auto', scrollBehavior: 'smooth', padding: '8px' }}
        >
            {children}
        </div>
    );
};
