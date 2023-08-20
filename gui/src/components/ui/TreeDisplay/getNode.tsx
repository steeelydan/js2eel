import { ArrayNode } from './ArrayNode';
import { ObjectNode } from './ObjectNode';

import type { VNode } from 'preact';

export const getNode = (key: string, value: unknown, path: string): VNode => {
    if (typeof value === 'string') {
        return (
            <div style={{ marginLeft: 20 }}>
                {key}: &quot;{value}&quot;
            </div>
        );
    } else if (typeof value === 'number') {
        return (
            <div style={{ marginLeft: 20 }}>
                {key}: {value}
            </div>
        );
    } else if (Array.isArray(value)) {
        return <ArrayNode name={key} array={value} path={path} />;
    } else if (typeof value === 'object' && value !== null) {
        return <ObjectNode name={key} object={value} path={path} />;
    } else {
        return (
            <div style={{ marginLeft: 20 }}>
                {key}: {JSON.stringify(value, null, 4)}
            </div>
        );
    }
};
