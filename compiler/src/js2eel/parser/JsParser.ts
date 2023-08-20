import * as acorn from 'acorn';

export class JsParser {
    src: string;

    constructor(jsSrc: string) {
        this.src = jsSrc;
    }

    parse(): { tree: acorn.Node | null; error?: any } {
        try {
            const tree = acorn.parse(this.src, {
                ecmaVersion: 2022,
                locations: true
            });

            return { tree, error: null };
        } catch (e) {
            return { tree: null, error: e };
        }
    }
}
