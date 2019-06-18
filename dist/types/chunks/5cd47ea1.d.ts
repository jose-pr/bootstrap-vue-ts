import OurVue from "5cd47ea1";
import BvEvent from "5cd47ea1";
import OurVue from "vue";
import Popper from "popper.js";
import { Dict, Primitive, VueElement, VueExtended, DirectiveBinding, VNode, Directive } from "5cd47ea1";
import { FunctionalComponentOptions, VueConstructor } from "vue";
import { PropOptions, RecordPropsDefinition } from "vue/types/options";
import { PopperOptions, Placement, Boundary, Behavior, Data } from "popper.js";
declare type ElementClass = string | string[];
declare type Primitive = string | boolean | number;
declare type BooleanLike = string | boolean | number;
declare type NumberLike = string | number;
interface Dict<T> {
    [key: string]: T;
}
declare const from: {
    <T>(arrayLike: ArrayLike<T>): T[];
    <T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
    <T>(iterable: Iterable<T> | ArrayLike<T>): T[];
    <T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
};
declare const isArray: (arg: any) => arg is any[];
declare const arrayIncludes: <T>(array: T[], value: T) => boolean;
declare const concat: <T>(...args: T[][]) => T[];
declare const assign: {
    <T, U>(target: T, source: U): T & U;
    <T, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
declare const getOwnPropertyNames: (o: any) => string[];
declare const keys: {
    (o: object): string[];
    (o: {}): string[];
};
declare const defineProperties: (o: any, properties: PropertyDescriptorMap & ThisType<any>) => any;
declare const defineProperty: (o: any, p: string | number | symbol, attributes: PropertyDescriptor & ThisType<any>) => any;
declare const freeze: {
    <T>(a: T[]): readonly T[];
    <T extends Function>(f: T): T;
    <T>(o: T): Readonly<T>;
};
declare const getOwnPropertyDescriptor: (o: any, p: string | number | symbol) => PropertyDescriptor | undefined;
declare const getOwnPropertySymbols: (o: any) => symbol[];
declare const getPrototypeOf: (o: any) => any;
declare const create: {
    (o: object | null): any;
    (o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
};
declare const isFrozen: (o: any) => boolean;
declare const is: (value1: any, value2: any) => boolean;
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 * Note object could be a complex type like array, date, etc.
 */
declare const isObject: (obj: any) => obj is Dict<any>;
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
declare const isPlainObject: (obj: any) => obj is Dict<any>;
declare const omit: <I extends Dict<any>, R>(obj: I, props: string[]) => Pick<I, Exclude<keyof I, keyof R>>;
declare const readonlyDescriptor: () => PropertyDescriptor;
/**
 * Deep-freezes and object, making it immutable / read-only.
 * Returns the same object passed-in, but frozen.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
declare const deepFreeze: <T>(obj: T) => Readonly<T>;
declare const hasOwnProperty: (obj: any, prop: string) => boolean;
interface BvEventInit {
    type: string;
    cancelable: boolean;
    nativeEvent: boolean;
    target: Element | null;
    relatedTarget: Element | null;
    vueTarget: any;
    componentId: string;
}
declare class BvEvent<T = never> implements Partial<Event> {
    type: string;
    cancelable: boolean;
    nativeEvent: boolean;
    target: Element | null;
    relatedTarget: Element | null;
    vueTarget: any;
    componentId: string;
    readonly defaultPrevented: boolean;
    readonly preventDefault: () => void;
    constructor(type: string, eventInit?: Partial<BvEventInit & T>);
    static readonly Defaults: {
        type: string;
        cancelable: boolean;
        nativeEvent: null;
        target: null;
        relatedTarget: null;
        vueTarget: null;
        componentId: null;
    };
}
declare const cloneDeep: <T>(obj: T, defaultValue?: T) => T;
declare const hasWindowSupport: boolean;
declare const hasDocumentSupport: boolean;
declare const hasNavigatorSupport: boolean;
declare const hasPromiseSupport: boolean;
declare const hasMutationObserverSupport: boolean;
declare const isBrowser: boolean;
declare const userAgent: string;
declare const isJSDOM: boolean;
declare const isIE: boolean;
declare const hasPassiveEventSupport: boolean;
declare const hasTouchSupport: boolean;
declare const hasPointerEventSupport: boolean;
declare const hasIntersectionObserverSupport: boolean;
declare const getEnv: (key: string, fallback?: null) => any;
declare const getNoWarn: () => any;
/**
 * Log a warning message to the console with BootstrapVue formatting
 * @param {string} message
 */
declare const warn: (message: string) => void;
/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */
declare const warnNotClient: (source: string) => boolean;
/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */
declare const warnNoPromiseSupport: (source: string) => boolean;
/**
 * Warn when no MutationObserver support is given
 * @param {string} source
 * @returns {boolean} warned
 */
declare const warnNoMutationObserverSupport: (source: string) => boolean;
declare function functionalComponent<Props>(options: Omit<FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>, 'functional'> & {
    methods?: Dict<Function>;
}): VueConstructor<Props & OurVue>;
/**
 * Checks if there are multiple instances of Vue, and warns (once) about possible issues.
 * @param {object} Vue
 */
declare const checkMultipleVue: (Vue: VueConstructor<OurVue>) => void;
declare type PropsDef<T> = {
    [k in keyof T]: PropOptions;
};
interface VueElement extends HTMLElement {
    __vue__: OurVue;
}
interface VueExtended extends OurVue {
    $route?: unknown;
    _isVue: boolean;
}
interface BvInstance {
    readonly $bvModal?: BvInstance;
    readonly $bvTotal?: BvInstance;
}
/**
 * Get property defined by dot/array notation in string.
 *
 * @link https://gist.github.com/jeneg/9767afdcca45601ea44930ea03e0febf#gistcomment-1935901
 *
 * @param {Object} obj
 * @param {string|Array} path
 * @param {*} defaultValue (optional)
 * @return {*}
 */
declare const get: <T>(obj: any, path: string, defaultValue?: T | null) => any;
declare const BV_CONFIG_PROP_NAME = "$bvConfig";
declare const memoize: <T, R>(fn: (...args: T[]) => R) => (...args: T[]) => R;
declare const getConfig: () => any;
declare const getConfigValue: (key: string) => any;
declare const getComponentConfig: (cmpName: string, key?: string | undefined) => any;
declare const getBreakpoints: () => string[];
declare const getBreakpointsCached: () => string[];
declare const getBreakpointsUp: () => string[];
declare const getBreakpointsUpCached: (...args: never[]) => string[];
declare const getBreakpointsDown: () => string[];
declare const getBreakpointsDownCached: () => string[];
declare const toType: (val: any) => "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
declare const toRawType: (val: any) => string;
declare const toRawTypeLC: (val: any) => string;
declare const isUndefined: (val: any) => val is undefined;
declare const isNull: (val: any) => val is null;
declare const isFunction: (val: any) => val is Function;
declare const isBoolean: (val: any) => val is boolean;
declare const isString: (val: any) => val is string;
declare const isNumber: (val: any) => val is number;
declare const isPrimitive: (val: any) => val is Primitive;
declare const isDate: (val: any) => val is Date;
declare const isRegExp: (val: any) => val is RegExp;
declare const isPromise: (val: any) => val is Promise<any>;
declare const isVueElement: (val: any) => val is VueElement;
declare const isElement: (el: unknown) => el is HTMLElement;
declare const matchesEl: (selectors: string) => boolean;
declare const matches: (el: unknown, selector: string) => boolean;
declare const closestEl: {
    <K extends "object" | "link" | "small" | "sub" | "sup" | "input" | "progress" | "select" | "h5" | "a" | "abbr" | "address" | "applet" | "area" | "article" | "aside" | "audio" | "b" | "base" | "basefont" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "button" | "canvas" | "caption" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "dir" | "div" | "dl" | "dt" | "em" | "embed" | "fieldset" | "figcaption" | "figure" | "font" | "footer" | "form" | "frame" | "frameset" | "h1" | "h2" | "h3" | "h4" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "ins" | "kbd" | "label" | "legend" | "li" | "main" | "map" | "mark" | "marquee" | "menu" | "meta" | "meter" | "nav" | "noscript" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "pre" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "script" | "section" | "slot" | "source" | "span" | "strong" | "style" | "summary" | "table" | "tbody" | "td" | "template" | "textarea" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "track" | "u" | "ul" | "var" | "video" | "wbr">(selector: K): HTMLElementTagNameMap[K] | null;
    <K extends "symbol" | "a" | "script" | "style" | "title" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "filter" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "stop" | "svg" | "switch" | "text" | "textPath" | "tspan" | "use" | "view">(selector: K): SVGElementTagNameMap[K] | null;
    (selector: string): Element | null;
};
declare global {
    interface Window {
        webkitRequestAnimationFrame(cb: FrameRequestCallback): number;
        mozRequestAnimationFrame(cb: FrameRequestCallback): number;
        msRequestAnimationFrame(cb: FrameRequestCallback): number;
        oRequestAnimationFrame(cb: FrameRequestCallback): number;
        MutationObserver: MutationObs;
        WebKitMutationObserver: MutationObs;
        MozMutationObserver: MutationObs;
    }
}
declare const requestAF: (callback: FrameRequestCallback) => number;
declare const MutationObs: MutationObs;
interface MutationObs {
    new (callback: MutationCallback): MutationObserver;
}
declare const parseEventOptions: (options?: boolean | EventListenerOptions | undefined) => boolean | EventListenerOptions;
declare const eventOn: (el: unknown, evtName: string, handler: EventListenerOrEventListenerObject, options?: EventListenerOptions | undefined) => void;
declare const eventOff: (el: unknown, evtName: string, handler: EventListenerOrEventListenerObject, options?: EventListenerOptions | undefined) => void;
declare const contains: (parent: Element, child: unknown) => boolean;
declare const reflow: (el: HTMLElement) => number;
declare const selectAll: (selector: string, root?: Element | undefined) => HTMLElement[];
declare const select: (selector: string | null | undefined, root?: Element | null | undefined) => HTMLElement | null;
declare const closest: (selector: string, root?: Element | null | undefined) => HTMLElement | null;
declare const getById: (id: string) => HTMLElement | null;
declare const addClass: (el: unknown, className: string) => void;
declare const removeClass: (el: unknown, className: string) => void;
declare const hasClass: (el: HTMLElement | null | undefined, className: string) => boolean;
declare const setAttr: (el?: Element | null | undefined, attr?: string | undefined, value?: string | undefined) => void;
declare const removeAttr: (el?: Element | null | undefined, attr?: string | undefined) => void;
declare const getAttr: (el?: Element | null | undefined, attr?: string | undefined) => string | null;
declare const hasAttr: (el: Element, attr: string) => boolean | null;
declare const getBCR: (el: unknown) => ClientRect | DOMRect | null;
declare const getCS: (el: Element | null) => CSSStyleDeclaration;
declare const offset: (el: unknown) => {
    top: number;
    left: number;
};
declare const position: (el: unknown) => {
    top: number;
    left: number;
};
declare const isVisible: (el: unknown) => boolean;
declare const isDisabled: (el?: HTMLInputElement | null | undefined) => boolean;
declare abstract class Directive<ConfigType> {
    protected ['constructor']: unknown;
    $element?: HTMLElement;
    $root?: VueExtended;
    $config?: ConfigType;
    $timeouts?: Dict<number | undefined>;
    $intervals?: Dict<number | undefined>;
    constructor(element: HTMLElement, config: Partial<ConfigType>, $root?: VueExtended);
    init(): void;
    static readonly NAME: string;
    readonly name: string;
    readonly defaultConfig: ConfigType;
    getStaticProp<T>(name: keyof T): T[keyof T];
    static readonly DEFAULT: unknown;
    static readonly DEFAULT_TYPE: unknown;
    static ParseBindings(bindings: DirectiveBinding): unknown;
    static readonly ElementHoldingProp: string;
    static ValidateApply(element: HTMLElement, config: DirectiveBinding, $root?: VNode): boolean;
    static Dispose(el: HTMLElement): void;
    static Apply(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void;
    preUpdateConfig(): void;
    postUpdateConfig(): void;
    updateConfig(config: Partial<ConfigType>, $root?: VueExtended): void;
    processConfig(config: ConfigType): ConfigType;
    clearProps(): void;
    dispose(): void;
    preDispose(): void;
    postDispose(): void;
    listen(): void;
    unListen(): void;
    activeTimeout(name: string): boolean;
    activeInterval(name: string): boolean;
    setTimeout(name: string, handler: TimerHandler, timeout?: number, ...args: unknown[]): number;
    clearTimeout(name: string): void;
    setInterval(name: string, handler: TimerHandler, timeout?: number, ...args: unknown[]): number;
    clearInterval(name: string): void;
    static GetBvDirective(): {
        bind(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void;
        inserted(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void;
        update(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void;
        componentUpdated(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void;
        unbind(el: HTMLElement): void;
    };
}
declare const noop: () => void;
declare const TestNever1: () => string;
declare const TestNever2: () => string;
declare const TestNever3: () => string;
/**
 * Observe a DOM element changes, falls back to eventListener mode
 * @param {Element} el The DOM element to observe
 * @param {Function} callback callback to be called on change
 * @param {object} [opts={childList: true, subtree: true}] observe options
 * @see http://stackoverflow.com/questions/3219758
 */
declare const observeDom: (el: Element | OurVue | null, callback: () => void, opts: {}) => MutationObserver | null;
declare const TestPartial1: () => string;
declare const TestPartial2: () => string;
declare const TestPartial3: () => string;
/**
 * Convert a value to a string that can be rendered.
 */
declare const toString: (val: any, spaces?: number) => string;
declare const stringifyQueryObj: (obj: any) => string;
declare const parseQuery: (query: any) => Dict<string | (string | null)[] | null>;
declare const isRouterLink: (tag: string) => boolean;
interface routerPathObj {
    path?: string;
    query?: string;
    hash?: string;
}
declare const computeTag: ({ to, disabled }: {
    to?: string | routerPathObj | undefined;
    disabled?: boolean | undefined;
} | undefined, thisOrParent: any) => "a" | "nuxt-link" | "router-link";
declare const computeRel: ({ target, rel }?: {
    target?: string | undefined;
    rel?: string | undefined;
}) => string | null;
declare const computeHref: ({ href, to }?: {
    href?: string | undefined;
    to?: string | routerPathObj | undefined;
}, tag?: string, fallback?: string, toFallback?: string) => string | null;
declare const getTargets: (binding: DirectiveBinding) => string[];
declare const bindTargets: (vnode: VNode, binding: DirectiveBinding, listenTypes: Dict<boolean>, fn: (target: {
    targets: string[];
    vnode: VNode;
}) => void) => string[];
declare const unbindTargets: (vnode: VNode, binding: DirectiveBinding, listenTypes: Dict<boolean>) => void;
interface ToolTipConfig {
    animation: boolean;
    template: string;
    trigger: string;
    title: string;
    delay: number | {
        show: number;
        hide: number;
    };
    html: boolean;
    placement: Placement;
    offset: number;
    arrowPadding: number | string;
    container: boolean | string;
    fallbackPlacement: Behavior;
    callbacks: Dict<Function>;
    boundary: HTMLElement | Boundary;
    boundaryPadding: number;
    content: string;
}
export * from 'vue';
export * from 'vue/types/options';
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export * from "5cd47ea1";
export { ElementClass, Primitive, BooleanLike, NumberLike, Dict, from, isArray, arrayIncludes, concat, assign, getOwnPropertyNames, keys, defineProperties, defineProperty, freeze, getOwnPropertyDescriptor, getOwnPropertySymbols, getPrototypeOf, create, isFrozen, is, isObject, isPlainObject, omit, readonlyDescriptor, deepFreeze, hasOwnProperty, BvEvent, cloneDeep, hasWindowSupport, hasDocumentSupport, hasNavigatorSupport, hasPromiseSupport, hasMutationObserverSupport, isBrowser, userAgent, isJSDOM, isIE, hasPassiveEventSupport, hasTouchSupport, hasPointerEventSupport, hasIntersectionObserverSupport, getEnv, getNoWarn, warn, warnNotClient, warnNoPromiseSupport, warnNoMutationObserverSupport, functionalComponent, checkMultipleVue, PropsDef, VueElement, VueExtended, BvInstance, get, BV_CONFIG_PROP_NAME, memoize, getConfig, getConfigValue, getComponentConfig, getBreakpoints, getBreakpointsCached, getBreakpointsUp, getBreakpointsUpCached, getBreakpointsDown, getBreakpointsDownCached, toType, toRawType, toRawTypeLC, isUndefined, isNull, isFunction, isBoolean, isString, isNumber, isPrimitive, isDate, isRegExp, isPromise, isVueElement, isElement, matchesEl, matches, closestEl, requestAF, MutationObs, parseEventOptions, eventOn, eventOff, contains, reflow, selectAll, select, closest, getById, addClass, removeClass, hasClass, setAttr, removeAttr, getAttr, hasAttr, getBCR, getCS, offset, position, isVisible, isDisabled, Directive, noop, TestNever1, TestNever2, TestNever3, observeDom, TestPartial1, TestPartial2, TestPartial3, toString, stringifyQueryObj, parseQuery, isRouterLink, computeTag, computeRel, computeHref, bindTargets, unbindTargets, getTargets, ToolTipConfig };
