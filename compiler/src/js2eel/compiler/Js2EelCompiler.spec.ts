import { expect } from 'chai';
import { Js2EelCompiler } from './Js2EelCompiler';
import { testEelSrc } from '../test/helpers';

describe('Js2EelCompiler', () => {
    it('setReturn(). getReturn()', () => {
        const compiler = new Js2EelCompiler();

        const result =
            compiler.compile(`config({ description: 'somefunc', inChannels: 2, outChannels: 2 });

function myFunc() {
    return 3;
}

onSample(() => {
    spl0 = myFunc();
});`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.0 */

desc:somefunc

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample

R__S1__0 = 3;
spl0 = R__S1__0;


`)
        );
        expect(compiler.getReturn('root')).to.equal(null);
        expect(compiler.getErrors().length).to.equal(0);
        expect(compiler.getReturn('root/someStuff')).to.equal(null);
        expect(compiler.getErrors().length).to.equal(1);
        expect(compiler.getErrors()[0].type).to.equal('InternalError');
        expect(compiler.getReturn('someStuff')).to.equal(null);
        expect(compiler.getErrors().length).to.equal(2);
        expect(compiler.getErrors()[1].type).to.equal('InternalError');
        expect(compiler.getReturn('..\\invalid//path')).to.equal(null);
        expect(compiler.getErrors().length).to.equal(3);
        expect(compiler.getErrors()[2].type).to.equal('InternalError');
        expect(compiler.getReturn('root/myFunc')?.src).to.equal('3');
        expect(compiler.getReturn('root/myFunc')?.symbolSrc).to.equal('R__S1');

        compiler.setReturn('wrongpath', '2');
        expect(compiler.getErrors().length).to.equal(4);
        expect(compiler.getErrors()[3].type).to.equal('InternalError');
    });

    it('setEelArray(), getEelArray()', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'somefunc', inChannels: 2, outChannels: 2 });

const myArr = new EelArray(2, 2);
const myBuf = new EelBuffer(2, 6);
`);
        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:somefunc

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

myBuf__B0 = 0 * 6;
myBuf__B1 = 1 * 6;
myBuf__size = 6;


`)
        );
        compiler.setEelArray({ dimensions: 2, name: 'myArr', size: 3 });
        expect(compiler.getErrors().length).to.equal(1);
        expect(compiler.getErrors()[0].type).to.equal('SymbolAlreadyDeclaredError');
        compiler.setEelBuffer({ dimensions: 2, name: 'myBuf', sizeSrc: '6' });
        expect(compiler.getErrors().length).to.equal(2);
        expect(compiler.getErrors()[1].type).to.equal('SymbolAlreadyDeclaredError');
    });

    it('setSymbolUsed(), setDeclaredSymbolByScopePath()', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'somevar', inChannels: 2, outChannels: 2 });

const someVar = 3;
console.log(someVar);`);

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:somevar

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someVar = 3;


__debug__someVar = someVar;
`)
        );

        compiler.setDeclaredSymbolByScopePath('root/1', 'someOtherVar', {
            used: false,
            declarationType: 'const',
            inScopePath: 'root/1',
            inScopeSuffix: 0,
            name: 'someOtherVar',
            node: {
                type: 'VariableDeclarator',
                loc: {
                    start: {
                        line: 3,
                        column: 6
                    },
                    end: {
                        line: 3,
                        column: 17
                    }
                },
                id: {
                    type: 'Identifier',
                    loc: {
                        start: {
                            line: 3,
                            column: 6
                        },
                        end: {
                            line: 3,
                            column: 13
                        }
                    },
                    name: 'someVar'
                },
                init: {
                    type: 'Literal',
                    loc: {
                        start: {
                            line: 3,
                            column: 16
                        },
                        end: {
                            line: 3,
                            column: 17
                        }
                    },
                    value: 3,
                    raw: '3'
                }
            },
            currentAssignment: {
                type: 'variable',
                eelSrc: 'someVar = 3;'
            }
        });

        expect(compiler.getErrors().length).to.equal(1);
        expect(compiler.getErrors()[0].type).to.equal('ScopeError');

        compiler.moveUpInScope();

        compiler.setDeclaredSymbol('someThirdVar', {
            used: false,
            declarationType: 'const',
            inScopePath: 'root/1',
            inScopeSuffix: 0,
            name: 'someThirdVar',
            node: {
                type: 'VariableDeclarator',
                loc: {
                    start: {
                        line: 3,
                        column: 6
                    },
                    end: {
                        line: 3,
                        column: 17
                    }
                },
                id: {
                    type: 'Identifier',
                    loc: {
                        start: {
                            line: 3,
                            column: 6
                        },
                        end: {
                            line: 3,
                            column: 13
                        }
                    },
                    name: 'someVar'
                },
                init: {
                    type: 'Literal',
                    loc: {
                        start: {
                            line: 3,
                            column: 16
                        },
                        end: {
                            line: 3,
                            column: 17
                        }
                    },
                    value: 3,
                    raw: '3'
                }
            },
            currentAssignment: {
                type: 'variable',
                eelSrc: 'someVar = 3;'
            }
        });

        expect(compiler.getErrors().length).to.equal(3);
        expect(compiler.getErrors()[1].type).to.equal('InternalError');
        expect(compiler.getErrors()[2].type).to.equal('ScopeError');
    });

    it("Doesn't give multiple errors in eachChannel()", () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'somevar', inChannels: 2, outChannels: 2 });

let someVar = 1;

onSample(() => {
    eachChannel((sample, channel) => {
        someVar += someOtherVar;
        4 ^ someVar;
    });
});
`
        );

        expect(result.success).to.equal(false);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:somevar

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@init

someVar = 1;


@sample


/* Channel 0 */

someVar += ;

/* Channel 1 */

someVar += ;



`)
        );
        expect(result.errors.length).to.equal(2);
        expect(result.errors[0].type).to.equal('UnknownSymbolError');
        expect(result.errors[1].type).to.equal('OperatorError');
        expect(result.warnings.length).to.equal(2);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(result.warnings[1].type).to.equal('SymbolUnusedWarning');
    });

    it("Doesn't give multiple warnings in eachChannel()", () => {
        const compiler = new Js2EelCompiler();
        const result = compiler.compile(
            `config({ description: 'somevar', inChannels: 2, outChannels: 2 });

onSample(() => {
    eachChannel((sample, channel) => {
        const someVar = 1;
    });
});
`
        );

        expect(result.success).to.equal(true);
        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.1.1 */

desc:somevar

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


@sample


/* Channel 0 */

someVar__S4 = 1;

/* Channel 1 */

someVar__S5 = 1;



`)
        );
        expect(result.errors.length).to.equal(0);
        expect(result.warnings.length).to.equal(3);
        expect(result.warnings[0].type).to.equal('SymbolUnusedWarning');
        expect(result.warnings[1].type).to.equal('SymbolUnusedWarning');
        expect(result.warnings[2].type).to.equal('SymbolUnusedWarning');
    });

    it('variables bound to sliders', () => {
        const compiler = new Js2EelCompiler();
        const result =
            compiler.compile(`config({ description: 'boundvars', inChannels: 2, outChannels: 2 });

let myVar;

slider(1, myVar, 3, 0, 4, 1, 'mySlider1');
slider(2, myVar, 5, 0, 10, 1, 'mySlider2');`);

        expect(testEelSrc(result.src)).to.equal(
            testEelSrc(`/* Compiled with JS2EEL v0.0.24 */

desc:boundvars

slider1:myVar=3 < 0, 4, 1 >mySlider1

in_pin:In 0
in_pin:In 1
out_pin:In 0
out_pin:In 1


`)
        );

        expect(result.success).to.equal(false);
        expect(result.errors.length).to.equal(1);
        expect(result.errors[0].type).to.equal('BindingError');
    });
});
