import type { EelGeneratorError, EelGeneratorWarning } from '../types';

export const sortErrorsOrWarnings = <T extends EelGeneratorError | EelGeneratorWarning>(
    items: T[]
): T[] => {
    return items.sort((a, b): number =>
        a.node?.loc?.start !== undefined &&
        b.node?.loc?.start !== undefined &&
        a.node.loc.start.line < b.node.loc.start.line
            ? -1
            : 1
    );
};
