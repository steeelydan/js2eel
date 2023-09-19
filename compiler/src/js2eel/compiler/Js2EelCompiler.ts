import { ALL_RESERVED_SYMBOL_NAMES, COMPILER_VERSION } from '../constants.js';
import { JsParser } from '../parser/JsParser.js';
import { getSymbolInNextUpScope } from '../environment/getSymbolInNextUpScope.js';
import { suffixEelBuffer } from '../suffixersAndPrefixers/suffixEelBuffer.js';
import { suffixBufferSize } from '../suffixersAndPrefixers/suffixBufferSize.js';
import { program } from '../generatorNodes/program/program.js';

import type { Node, Program } from 'estree';
import type {
    EelBuffer,
    EelGeneratorError,
    EelArray,
    EelGeneratorWarning,
    JSFXStage,
    Slider,
    DeclaredSymbol,
    Environment,
    CompileResult,
    PluginData,
    EachChannelParamMap,
    ErrorType,
    ScopedEnvironment,
    SelectBox,
    WarningType,
    ReturnSrc,
    InlineData
} from '../types.js';
import { inScope } from '../environment/inScope.js';
import { getLastScopePathSeparator } from '../../shared/shared.js';
import { sortErrorsOrWarnings } from '../utils/sortErrorsOrWarnings.js';
import { suffixScopeByScopeSuffix } from '../suffixersAndPrefixers/suffixScope.js';

export class Js2EelCompiler {
    private meta: {
        errors: EelGeneratorError[];
        warnings: EelGeneratorWarning[];
    } = {
        errors: [],
        warnings: []
    };
    private src: {
        eelSrcTemp: string;
        eelSrcFinal: string;
        outsideSrc: string;
        onBlockSrc: string;
        onInitSrc: string;
        onSliderSrc: string;
        onSampleSrc: string;
    } = {
        eelSrcTemp: '',
        eelSrcFinal: '',
        outsideSrc: '',
        onBlockSrc: '',
        onInitSrc: '',
        onSliderSrc: '',
        onSampleSrc: ''
    };
    private pluginData: PluginData = {
        name: '',
        description: '',
        inChannels: 2,
        outChannels: 2,
        currentChannel: 0,
        eachChannelParamMap: {},
        currentScopePath: 'root',
        currentScopeSuffix: 0,
        currentInlineData: null,
        highestScopeSuffix: 0,
        usedStages: new Set(),
        sliderNumbers: new Set(),
        sliders: {},
        selectBoxes: {},
        eelBuffers: {},
        eelArrays: {},
        environment: {
            root: {
                scopeSuffix: 0,
                scopeId: 'root',
                returnSrc: null,
                lowercaseDeclaredSymbols: {},
                symbols: {}
            }
        },
        initVariableNames: []
    };

    error(type: ErrorType, msg: string, object: Node | undefined | null): void {
        // Do not create duplicate errors for each channel
        if (inScope('eachChannel', this) && this.getCurrentChannel() !== 0) {
            return;
        }

        const error: EelGeneratorError = {
            type: type,
            msg: `${msg}${
                /*
                omitNodePrint ? '' : '\n  Node: ' + object?.type */
                ''
            }`,
            node: object
        };

        this.meta.errors.push(error);
    }

    multipleErrors(errors: EelGeneratorError[]): void {
        this.meta.errors = [...this.meta.errors, ...errors];
    }

    warning(type: WarningType, msg: string, object: Node | undefined | null): void {
        // Do not create duplicate warnings for each channel
        // if (inScope('eachChannel', this) && this.getCurrentChannel() !== 0) {
        //     return;
        // }

        const warning: EelGeneratorWarning = {
            type: type,
            msg: `${msg}`,
            node: object
        };

        this.meta.warnings.push(warning);
    }

    reset(): void {
        this.meta = { errors: [], warnings: [] };
        this.src = {
            eelSrcTemp: '',
            eelSrcFinal: '',
            outsideSrc: '',
            onBlockSrc: '',
            onInitSrc: '',
            onSliderSrc: '',
            onSampleSrc: ''
        };
        this.pluginData = {
            name: '',
            description: '',
            inChannels: 2,
            outChannels: 2,
            currentChannel: 0,
            eachChannelParamMap: {},
            currentScopePath: 'root',
            currentScopeSuffix: 0,
            currentInlineData: null,
            highestScopeSuffix: 0,
            usedStages: new Set(),
            sliderNumbers: new Set(),
            sliders: {},
            selectBoxes: {},
            eelBuffers: {},
            eelArrays: {},
            environment: {
                root: {
                    scopeSuffix: 0,
                    scopeId: 'root',
                    returnSrc: null,
                    lowercaseDeclaredSymbols: {},
                    symbols: {}
                }
            },
            initVariableNames: []
        };
    }

    compile(jsSource: string): CompileResult {
        this.reset();

        const jsParser = new JsParser(jsSource);

        const { tree, error: parserError } = jsParser.parse();

        if (parserError) {
            return {
                success: false,
                errors: sortErrorsOrWarnings(this.meta.errors),
                parserError: parserError,
                name: this.pluginData.name,
                src: this.src.eelSrcFinal,
                tree: null,
                warnings: sortErrorsOrWarnings(this.meta.warnings),
                pluginData: this.pluginData
            };
        }

        this.src.eelSrcTemp += program(tree as unknown as Program, this);

        if (!this.pluginData.description) {
            this.error(
                'GenericError',
                'No plugin configuration found. Call config() at the beginning of the file.',
                null
            );
        }

        this.src.eelSrcFinal += `/* Compiled with JS2EEL v${COMPILER_VERSION} */\n\n`;

        this.src.eelSrcFinal += `desc:${this.pluginData.description}\n`;

        this.setName(this.pluginData.description || 'jsfx_plugin');

        this.src.eelSrcFinal += '\n';

        // SLIDERS

        // FIXME order!!
        if (Object.keys(this.pluginData.sliders).length) {
            for (const [_name, slider] of Object.entries(this.pluginData.sliders)) {
                this.src.eelSrcFinal += `slider${slider.sliderNumber}:${slider.variable}=${slider.initialValue} < ${slider.min}, ${slider.max}, ${slider.step} >${slider.label}\n`;
            }

            this.src.eelSrcFinal += '\n';
        }

        // SELECTBOXES

        if (Object.keys(this.pluginData.selectBoxes).length) {
            for (const [_name, selectBox] of Object.entries(this.pluginData.selectBoxes)) {
                this.src.eelSrcFinal += `slider${selectBox.sliderNumber}:${
                    selectBox.variable
                }=${selectBox.values.findIndex(
                    (value) => value.name === selectBox.initialValue
                )} < ${0}, ${selectBox.values.length}, ${1} ${
                    '{' + selectBox.values.map((value) => value.label).join(', ') + '}'
                } >${selectBox.label}\n`;
            }

            this.src.eelSrcFinal += '\n';
        }

        // IN_PIN & OUT_PIN

        for (let i = 0; i < this.pluginData.inChannels; i++) {
            this.src.eelSrcFinal += `in_pin:In ${i}\n`;
        }
        for (let i = 0; i < this.pluginData.outChannels; i++) {
            this.src.eelSrcFinal += `out_pin:In ${i}\n`;
        }

        this.src.eelSrcFinal += '\n\n';

        // @INIT

        let initStageText = '';

        const initStageHeader = '@init\n\n';

        this.pluginData.initVariableNames.forEach((initVariableName) => {
            // Cannot declare slider identifier in eel2
            if (!this.pluginData.sliders[initVariableName]) {
                const declaredSymbol = this.getDeclaredSymbolUpInScope(initVariableName);

                /* c8 ignore next 5 */
                if (!declaredSymbol) {
                    throw new Error(
                        "Couldn't find declared symbol for init var " + initVariableName
                    );
                }

                initStageText += declaredSymbol.symbol.eelSrc;
            }
        });

        // Buffers

        for (const [_eelBufferName, eelBuffer] of Object.entries(this.pluginData.eelBuffers)) {
            if (eelBuffer) {
                for (let i = 0; i < eelBuffer.dimensions; i++) {
                    initStageText += `${suffixEelBuffer(eelBuffer.name, i.toString())} = ${i} * ${
                        eelBuffer.sizeSrc
                    };\n`;
                }

                initStageText += `${suffixBufferSize(eelBuffer.name)} = ${eelBuffer.sizeSrc};\n`;
            }
        }

        // Arrays

        // for (const [_eelArrayName, eelArray] of Object.entries(this.pluginData.eelArrays)) {
        //     if (eelArray) {
        //         for (let i = 0; i < eelArray.dimensions; i++) {
        //             for (let j = 0; j < eelArray.size; j++) {
        //                 initStageText += `${suffixEelArray(
        //                     eelArray.name,
        //                     i.toString(),
        //                     j.toString()
        //                 )};\n`;
        //             }
        //         }
        //     }
        // }

        if (initStageText) {
            initStageText = initStageHeader + initStageText;
            this.src.eelSrcFinal += initStageText;
            this.src.eelSrcFinal += '\n\n';
        }

        // @SLIDER

        const sliderStageHeader = '@slider\n\n';
        const sliderText = this.getOnSliderSrc();
        if (sliderText) {
            this.src.eelSrcFinal += sliderStageHeader;
            this.src.eelSrcFinal += sliderText;
            this.src.eelSrcFinal += '\n\n';
        }

        // @SAMPLE

        const sampleStageHeader = '@sample\n\n';
        const sampleText = this.getOnSampleSrc();
        if (sampleText) {
            this.src.eelSrcFinal += sampleStageHeader;
            this.src.eelSrcFinal += sampleText;
            this.src.eelSrcFinal += '\n\n';
        }

        this.src.eelSrcFinal += this.src.eelSrcTemp;

        for (const [_scopePath, scopedEnvironment] of Object.entries(this.pluginData.environment)) {
            if (scopedEnvironment) {
                for (const [variableName, declaredVariable] of Object.entries(
                    scopedEnvironment.symbols
                )) {
                    if (
                        declaredVariable &&
                        !declaredVariable.used &&
                        !variableName.startsWith('_')
                    ) {
                        this.warning(
                            'SymbolUnusedWarning',
                            `Variable unused: ${variableName}`,
                            declaredVariable.node
                        );
                    }
                }
            }
        }

        const retSrc = this.src.eelSrcFinal;

        return {
            success: !this.meta.errors.length,
            name: this.pluginData.name,
            src: retSrc,
            tree: tree,
            errors: sortErrorsOrWarnings(this.meta.errors),
            parserError: parserError,
            warnings: sortErrorsOrWarnings(this.meta.warnings),
            pluginData: {
                ...this.pluginData,
                environment: JSON.parse(JSON.stringify(this.pluginData.environment)) // Fix Electron IPC problem with JOI validator function serialization at environment.<scope>.symbols.<symbol>.argDefinition... etc.
                // https://stackoverflow.com/questions/70839472/electron-reply-error-an-object-could-not-be-cloned
            }
        };
    }

    getErrors(): EelGeneratorError[] {
        return this.meta.errors;
    }

    setName(name: string): void {
        this.pluginData.name = name;
    }

    setDescription(description: string): void {
        this.pluginData.description = description;
    }

    getDescription(): string {
        return this.pluginData.description;
    }

    addSlider(slider: Slider): void {
        this.pluginData.sliders[slider.variable] = slider;
    }

    getSlider(sliderName: string): Slider | undefined {
        return this.pluginData.sliders[sliderName];
    }

    addSelectBox(selectBox: SelectBox): void {
        this.pluginData.selectBoxes[selectBox.variable] = selectBox;
    }

    getSelectBox(selectBoxName: string): SelectBox | undefined {
        return this.pluginData.selectBoxes[selectBoxName];
    }

    setOnInitSrc(src: string): void {
        this.src.onInitSrc = src;
    }

    setOnSliderSrc(src: string): void {
        this.src.onSliderSrc = src;
    }

    getOnSliderSrc(): string {
        return this.src.onSliderSrc;
    }

    setOnSampleSrc(src: string): void {
        this.src.onSampleSrc = src;
    }

    getOnSampleSrc(): { [channel in number]: string } {
        return this.src.onSampleSrc;
    }

    setDeclaredSymbol(symbolName: string, symbol: DeclaredSymbol): void {
        const currentScope = this.getCurrentScopePath();

        const scopedEnvironment = this.pluginData.environment[currentScope];

        if (scopedEnvironment) {
            scopedEnvironment.lowercaseDeclaredSymbols[symbolName.toLowerCase()] = true;
            scopedEnvironment.symbols[symbolName] = symbol;
        } else {
            this.error('ScopeError', `Couldn't find scope entry for symbol ${symbolName}`, null);
        }
    }

    setDeclaredSymbolByScopePath(
        scopePath: string,
        symbolName: string,
        symbol: DeclaredSymbol
    ): void {
        const scopedEnvironment = this.pluginData.environment[scopePath];

        if (scopedEnvironment) {
            scopedEnvironment.lowercaseDeclaredSymbols[symbolName.toLowerCase()] = true;
            scopedEnvironment.symbols[symbolName] = symbol;
        } else {
            this.error(
                'ScopeError',
                `Couldn't find scope entry for symbol ${symbolName}, scopePath ${scopePath}`,
                symbol.node
            );
        }
    }

    getDeclaredSymbolUpInScope(
        name: string
    ): { symbol: DeclaredSymbol; scopeSuffix: number } | null {
        return getSymbolInNextUpScope(name, this);
    }

    // getDeclaredSymbolByScopePath(scopePath: string, symbolName: string): DeclaredSymbol | null {
    //     const scopedEnvironment = this.pluginData.environment[scopePath];

    //     if (!scopedEnvironment) {
    //         return null;
    //     } else {
    //         return scopedEnvironment.returnSrcs;
    //     }
    // }

    getScopeRegister(): Environment {
        return this.pluginData.environment;
    }

    getScopeEntry(scopePath: string): ScopedEnvironment | undefined {
        return this.pluginData.environment[scopePath];
    }

    setInitVariableName(name: string): void {
        this.pluginData.initVariableNames.push(name);
    }

    getEelBuffer(eelBufferName: string): EelBuffer | undefined {
        return this.pluginData.eelBuffers[eelBufferName];
    }

    setEelBuffer(eelBuffer: EelBuffer): void {
        if (!this.pluginData.eelBuffers[eelBuffer.name]) {
            this.pluginData.eelBuffers[eelBuffer.name] = eelBuffer;
        } else {
            this.error(
                'SymbolAlreadyDeclaredError',
                'EelBuffer with this name already exists: ' + eelBuffer.name,
                null
            );
        }
    }

    getEelArray(eelArrayName: string): EelArray | undefined {
        return this.pluginData.eelArrays[eelArrayName];
    }

    setEelArray(eelArray: EelArray): void {
        if (!this.pluginData.eelArrays[eelArray.name]) {
            this.pluginData.eelArrays[eelArray.name] = eelArray;
        } else {
            this.error(
                'SymbolAlreadyDeclaredError',
                'EelArray with this name already exists: ' + eelArray.name,
                null
            );
        }
    }

    setEachChannelParamMapEntry(
        param: 'sampleIdentifier' | 'channelIdentifier',
        name: string | undefined
    ): void {
        this.pluginData.eachChannelParamMap[param] = name;
    }

    getEachChannelParams(): EachChannelParamMap {
        return this.pluginData.eachChannelParamMap;
    }

    setChannels(inChannels: number, outChannels: number): void {
        this.pluginData.inChannels = inChannels;
        this.pluginData.outChannels = outChannels;
    }

    getChannels(): { inChannels: number; outChannels: number } {
        return { inChannels: this.pluginData.inChannels, outChannels: this.pluginData.outChannels };
    }

    setCurrentChannel(channel: number): void {
        this.pluginData.currentChannel = channel;
    }

    getCurrentChannel(): number {
        return this.pluginData.currentChannel;
    }

    moveDownInScope(scopeId: string | null): void {
        const newSuffix = this.pluginData.highestScopeSuffix + 1;
        const newScopeEntry: ScopedEnvironment = {
            scopeSuffix: newSuffix,
            scopeId: scopeId,
            returnSrc: null,
            lowercaseDeclaredSymbols: {},
            symbols: {}
        };
        const newScope = this.pluginData.currentScopePath + `/${scopeId || newSuffix}`;
        this.pluginData.currentScopePath = newScope;
        this.pluginData.environment[this.pluginData.currentScopePath] = newScopeEntry;
        this.pluginData.currentScopeSuffix = newSuffix;
        this.pluginData.highestScopeSuffix++;
    }

    moveUpInScope(): void {
        const lastPartPos = getLastScopePathSeparator(this.pluginData.currentScopePath);
        const newScope = this.pluginData.currentScopePath.slice(0, lastPartPos);
        this.pluginData.currentScopePath = newScope;
        const scopedEnvironment = this.pluginData.environment[newScope];
        if (scopedEnvironment) {
            this.pluginData.currentScopeSuffix = scopedEnvironment.scopeSuffix;
        } else {
            return this.error(
                'InternalError',
                `Couldn't find scope entry for scopePath ${newScope}`,
                null
            );
        }
    }

    getCurrentScopePath(): string {
        return this.pluginData.currentScopePath;
    }

    getCurrentScopeSuffix(): number {
        return this.pluginData.currentScopeSuffix;
    }

    setReturn(scopePath: string, rawSrc: string): void {
        const scopedEnvironment = this.pluginData.environment[scopePath];

        if (!scopedEnvironment) {
            return this.error(
                'InternalError',
                `Couldn't find scope entry for scopePath ${scopePath}`,
                null
            );
        }

        const returnSymbolSrc = suffixScopeByScopeSuffix('R', this.getCurrentScopeSuffix());

        scopedEnvironment.returnSrc = {
            src: rawSrc,
            symbolSrc: returnSymbolSrc
        }; // suffixScopeByScopeSuffix(returnSrc, scopeSuffix);
    }

    getReturn(scopePath: string): ReturnSrc | null {
        const scopedEnvironment = this.pluginData.environment[scopePath];

        if (!scopedEnvironment) {
            this.error(
                'InternalError',
                `Couldn't find scope entry for scopePath ${scopePath}`,
                null
            );

            return null;
        }

        return scopedEnvironment.returnSrc;
    }

    setSymbolUsed(symbolName: string): void {
        if (ALL_RESERVED_SYMBOL_NAMES.has(symbolName)) {
            return;
        }

        const foundSymbol = getSymbolInNextUpScope(symbolName, this);

        if (!foundSymbol) {
            // this.error(
            //     'UnknownSymbolError',
            //     `setSymbolUsed(): Could not find symbol ${symbolName}`,
            //     null
            // );

            // FIXME do sth?

            return;
        }

        if (!foundSymbol.symbol.used) {
            this.setDeclaredSymbolByScopePath(foundSymbol.symbol.inScopePath, symbolName, {
                ...foundSymbol.symbol,
                used: true
            });
        }
    }

    setUsedStage(stage: JSFXStage): void {
        this.pluginData.usedStages.add(stage);
    }

    getUsedStage(stage: JSFXStage): boolean {
        return this.pluginData.usedStages.has(stage);
    }

    startCurrentInlineData(): void {
        this.pluginData.currentInlineData = { counter: 0, srcs: [] };
    }

    addToCurrentInlineData(src: string): void {
        if (!this.pluginData.currentInlineData) {
            throw new Error('No currrent inline data');
        }

        this.pluginData.currentInlineData.srcs.push(src + '\n');
        this.pluginData.currentInlineData.counter++;
    }

    consumeCurrentInlineData(): InlineData | null {
        if (this.pluginData.currentInlineData?.srcs.length) {
            const inlineData = this.pluginData.currentInlineData;
            this.pluginData.currentInlineData = null;
            return inlineData;
        } else {
            return null;
        }
    }

    getInlineCounter(): number {
        if (!this.pluginData.currentInlineData) {
            throw new Error('getInlineCounter(): No current inline data');
        }

        return this.pluginData.currentInlineData.counter;
    }

    setSliderNumber(sliderNumber: number): void {
        this.pluginData.sliderNumbers.add(sliderNumber);
    }

    sliderNumberIsUsed(sliderNumber: number): boolean {
        return this.pluginData.sliderNumbers.has(sliderNumber);
    }
}
