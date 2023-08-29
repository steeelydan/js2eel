import { Button } from '../ui/Button';

import type { VNode } from 'preact';

type Props = {
    dir: string | null;
    setDir: (newDir: string) => void;
    onChoose: () => Promise<void>;
};

export const DirSelector = ({ dir, setDir, onChoose }: Props): VNode => {
    return (
        <div style={{ display: 'flex' }}>
            <input
                value={dir || ''}
                style={{ width: '100%', maxWidth: 500, marginRight: 8 }}
                onInput={(event): void => setDir((event.target as HTMLInputElement).value)}
            ></input>
            <Button label="Choose" onClick={onChoose} />
        </div>
    );
};
