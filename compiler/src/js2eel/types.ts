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
    extTailSize: number | null;
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
    fileSelectors: { [id in string]: FileSelector };
    eelBuffers: { [name in string]?: EelBuffer };
    eelBufferOffset: number;
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

export type ObjectRepresentation = Record<string, number>;

export type AllowedDeclarationType = 'const' | 'let' | 'param' | 'noIdentifier';

export type VariableAssignment = {
    type: 'variable';
    eelSrc: string;
};

export type FunctionAssignment = {
    type: 'function';
    anonymous: boolean;
    ownScopePath: string;
    ownScopeSuffix: number;
    eelSrc: string;
    argDefinition: ArgDefinition<string>[];
};

export type ResultFunctionAssignment = FunctionAssignment & {
    argDefinition: null;
};

export type ObjectAssignment = {
    type: 'object';
    eelSrc: string;
    value: ObjectRepresentation;
};

export type EelNewExpressionType = 'EelBuffer' | 'EelArray';

export type EelSymbolAssignment = {
    type: EelNewExpressionType;
    eelSrc: string;
};

export type DeclaredSymbol = {
    used: boolean;
    declarationType: AllowedDeclarationType;
    inScopePath: string;
    inScopeSuffix: number;
    name: string;
    node: Node | null | undefined;
    currentAssignment:
        | null
        | VariableAssignment
        | FunctionAssignment
        | ObjectAssignment
        | EelSymbolAssignment;
};
export type ResultDeclaredSymbol = DeclaredSymbol & {
    currentAssignment:
        | VariableAssignment
        | ResultFunctionAssignment
        | ObjectAssignment
        | EelSymbolAssignment;
};

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

export type FileSelector = {
    sliderNumber: number;
    variable: string;
    rawSliderName: string;
    path: string;
    defaultValue: string;
    label: string;
};

export type EelBuffer = {
    name: string;
    offset: number;
    dimensions: number;
    size: number;
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

export type ParsedFunctionArgument = {
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
