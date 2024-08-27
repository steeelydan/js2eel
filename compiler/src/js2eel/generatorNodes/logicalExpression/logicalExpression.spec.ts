import { expect } from 'chai';

import { Js2EelCompiler } from '../../compiler/Js2EelCompiler.js';
import { testEelSrc } from '../../test/helpers.js';

describe('logicalExpression()', () => {
    it('logical expression containing identifiers', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'logicalExpression',
    inChannels: 2,
    outChannels: 2
});

let one = true;
let two = false;

if (one && two) {
    console.log(one);
}
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:logicalExpression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

one = 1;
two = 0;


(one && two) ? (
    __debug__one = one;
);
`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('logical expression containing unary expressions', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'logicalExpression',
    inChannels: 2,
    outChannels: 2
});

let one = true;
let two = false;

if (!one && !two) {
    console.log(one);
}
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:logicalExpression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

one = 1;
two = 0;


(!one && !two) ? (
    __debug__one = one;
);
`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('logical expression containing binary expressions', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'logicalExpression',
    inChannels: 2,
    outChannels: 2
});

let one = 0;
let two = 1;

if (one > 0 && two < 2) {
    console.log(one);
}
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:logicalExpression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

one = 0;
two = 1;


(one > 0 && two < 2) ? (
    __debug__one = one;
);
`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('logical expression containing logical expressions', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'logicalExpression',
    inChannels: 2,
    outChannels: 2
});

let one = 0;
let two = 1;

if (one > 0 && two < 2 && (1 < 2 || 2 < 3)) {
    console.log(one);
}
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:logicalExpression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

one = 0;
two = 1;


((one > 0 && two < 2) && (1 < 2 || 2 < 3)) ? (
    __debug__one = one;
);
`)
        );
        expect(result.errors.length).to.equal(0);
    });

    it('error if left type wrong', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'logicalExpression',
    inChannels: 2,
    outChannels: 2
});

let one = true;
let two = false;

if (function myFunc() {} && two) {
    console.log(one);
}
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:logicalExpression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

one = 1;
two = 0;


?ä__DENY_COMPILATION ? (
    __debug__one = one;
);
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });

    it('error if right type wrong', () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(`config({
    description: 'logicalExpression',
    inChannels: 2,
    outChannels: 2
});

let one = true;
let two = false;

if (one && function myFunc() {}) {
    console.log(one);
}
`);
        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.10.0 */

desc:logicalExpression

in_pin:In 0
in_pin:In 1
out_pin:Out 0
out_pin:Out 1


@init

one = 1;
two = 0;


?ä__DENY_COMPILATION ? (
    __debug__one = one;
);
`)
        );
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('TypeError');
    });
});
