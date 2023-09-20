import type * as acorn from 'acorn';
import type Joi from 'joi';
import type { Expression, Node, SpreadElement } from 'estree';

export type ErrorType =
    | 'GenericError'
    | 'KeywordError'
    | 'TypeError'
    | 'StageError'
    | 'UnknownSymbolError'
    | 'SymbolAlreadyDeclaredError'
    | 'IllegalPropertyError'
    | 'BindingError'
    | 'ParameterError'
    | 'ArgumentError'
    | 'ValidationError'
    | 'ScopeError'
    | 'BoundaryError'
    | 'InternalError'
    | 'OperatorError'
    | 'EelConventionError';

export type EelGeneratorError = {
    msg: string;
    type: ErrorType;
    node: Node | undefined | null;
};

export type WarningType = 'SymbolUnusedWarning' | 'GenericWarning';

export type EelGeneratorWarning = {
    type: WarningType;
    msg: string;
    node: Node | undefined | null;
};

// Fixes Electron IPC problem with JOI validator function serialization. Offending: environment.<scope>.symbols.<symbol>.argDefinition...
// Not serializing the whole environment increases compile time about 30%
// https://stackoverflow.com/questions/70839472/electron-reply-error-an-object-could-not-be-cloned
// FIXME Think about hiding the humongous pluginData behind a debug flag anyway.
export type ResultPluginData = PluginData & {
    environment: ResultEnvironment;
};

export type CompileResult = {
    success: boolean;
    src: string;
    errors: EelGeneratorError[];
    warnings: EelGeneratorWarning[];
    parserError: any; // FIXME
    tree: acorn.Node | null;
    name: string;
    pluginData: ResultPluginData;
};

export type JSFXStage = 'onInit' | 'onSlider' | 'onBlock' | 'onSample' | 'onGfx';

export type InlineData = {
    counter: number;
    srcs: string[];
};

export type PluginData = {
    name: string;
    description: string;
    inChannels: number;
    outChannels: number;
    currentChannel: number;
    eachChannelParamMap: EachChannelParamMap;
    currentScopePath: string;
    currentScopeSuffix: number;
    currentInlineData: InlineData | null;
    highestScopeSuffix: number;
    usedStages: Set<JSFXStage>;
    sliderNumbers: Set<number>;
    sliders: { [name in string]: Slider };
    selectBoxes: { [name in string]: SelectBox };
    eelBuffers: { [name in string]?: EelBuffer };
    eelArrays: { [name in string]?: EelArray };
    environment: Environment;
    initVariableNames: string[];
};

export type ReturnSrc = { src: string; symbolSrc: string };

export type ScopedEnvironment = {
    scopeSuffix: number;
    scopeId: string | null;
    returnSrc: ReturnSrc | null;
    lowercaseDeclaredSymbols: Record<string, boolean>;
    symbols: {
        [symbolName in string]?: DeclaredSymbol;
    };
};
export type ResultScopedEnvironment = ScopedEnvironment & {
    symbols: {
        [symbolName in string]?: ResultDeclaredSymbol;
    };
};

export type Environment = {
    [scopePath in string]?: ScopedEnvironment;
};
export type ResultEnvironment = {
    [scopePath in string]?: ResultScopedEnvironment;
};

export type Returns = {
    [scope in string]?: string;
};

export type EachChannelParamMap = { sampleIdentifier?: string; channelIdentifier?: string };

export type AllowedDeclarationType = 'const' | 'let' | 'param';

export type VariableSymbol = {
    type: 'variable';
    declarationType: AllowedDeclarationType;
    inScopePath: string;
    inScopeSuffix: number;
    eelSrc: string;
    used: boolean;
    node: Node | null | undefined;
};

export type FunctionSymbol = {
    type: 'function';
    declarationType?: AllowedDeclarationType;
    anonymous: boolean;
    inScopePath: string;
    ownScopePath: string;
    inScopeSuffix: number;
    ownScopeSuffix: number;
    eelSrc: string;
    used: boolean;
    argDefinition: ArgDefinition<string>[];
    node: Node | null | undefined;
};

export type ResultFunctionSymbol = FunctionSymbol & {
    argDefinition: null;
};

export type ObjectSymbol = {
    type: 'object';
    declarationType: AllowedDeclarationType;
    inScopePath: string;
    inScopeSuffix: number;
    eelSrc: string;
    used: boolean;
    value: Record<string, unknown>;
    node: Node | null | undefined;
};

export type DeclaredSymbol = VariableSymbol | FunctionSymbol | ObjectSymbol;
export type ResultDeclaredSymbol = VariableSymbol | ResultFunctionSymbol | ObjectSymbol;

export type Slider = {
    sliderNumber: number;
    variable: string;
    label: string;
    initialValue: string;
    min: string;
    max: string;
    step: string;
};

export type SelectBox = {
    sliderNumber: number;
    variable: string;
    label: string;
    initialValue: string;
    values: { name: string; label: string }[];
};

export type EelBuffer = {
    name: string;
    dimensions: number;
    sizeSrc: string;
};

export type EelArray = {
    name: string;
    dimensions: number;
    size: number;
};

export type ArgDefinition<ArgName> = {
    name: ArgName;
    required: boolean;
    allowedValues: FunctionCallAllowedValues;
};

export type ParsedFunctionArgument /*<T>*/ = {
    name: string;
    scopedName: any;
    value: any;
    node: Expression | SpreadElement;
};

export type ParamDefinition<ParamName> = {
    name: ParamName;
    required: boolean;
    allowedValues: {
        nodeType: 'Identifier';
    }[];
};

export type ParsedFunctionParameter /*<T>*/ = {
    scopedValue: any; // FIXME T | null;
    rawValue: any;
};

export type ValidatableFunctionCallAllowedValue = {
    nodeType: 'UnaryExpression' | 'Literal' | 'ObjectExpression' | 'ArrayExpression';
    validationSchema: Joi.Schema;
};

export type NonValidatableFunctionCallAllowedValue = {
    nodeType:
        | 'Identifier'
        | 'BinaryExpression'
        | 'ArrowFunctionExpression'
        | 'FunctionExpression'
        | 'CallExpression'
        | 'MemberExpression';
};

export type FunctionCallAllowedValues = (
    | ValidatableFunctionCallAllowedValue
    | NonValidatableFunctionCallAllowedValue
)[];

export type ObjectValue = string | number | bigint | boolean | RegExp | null | undefined;

export type DesktopSettings = {
    appDir: string | null;
    reaperDefaultEffectsDir: string | null;
    inputDir?: string | null;
    outputDir?: string | null;
};
