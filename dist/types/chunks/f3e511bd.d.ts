import OurVue from "vue";
import { Dict, Primitive, VueElement, VNode, DirectiveBinding } from "f3e511bd";
import { FunctionalComponentOptions, VueConstructor } from "vue";
import { PropOptions, RecordPropsDefinition } from "vue/types/options";
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
interface BvInstance {
    readonly $bvModal?: BvInstance;
    readonly $bvTotal?: BvInstance;
}
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
declare const matchesEl: (selectors: string) => boolean;
declare const closestEl: {
    <K extends "object" | "link" | "small" | "sub" | "sup" | "input" | "progress" | "select" | "a" | "abbr" | "address" | "applet" | "area" | "article" | "aside" | "audio" | "b" | "base" | "basefont" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "button" | "canvas" | "caption" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "dir" | "div" | "dl" | "dt" | "em" | "embed" | "fieldset" | "figcaption" | "figure" | "font" | "footer" | "form" | "frame" | "frameset" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "ins" | "kbd" | "label" | "legend" | "li" | "main" | "map" | "mark" | "marquee" | "menu" | "meta" | "meter" | "nav" | "noscript" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "pre" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "script" | "section" | "slot" | "source" | "span" | "strong" | "style" | "summary" | "table" | "tbody" | "td" | "template" | "textarea" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "track" | "u" | "ul" | "var" | "video" | "wbr">(selector: K): HTMLElementTagNameMap[K] | null;
    <K extends "symbol" | "a" | "script" | "style" | "title" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "filter" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "stop" | "svg" | "switch" | "text" | "textPath" | "tspan" | "use" | "view">(selector: K): SVGElementTagNameMap[K] | null;
    (selector: string): Element | null;
};
declare const requestAF: (callback: FrameRequestCallback) => number;
declare const MutationObs: MutationObs;
interface MutationObs {
    new (callback: MutationCallback): MutationObserver;
}
declare const parseEventOptions: (options?: boolean | EventListenerOptions | undefined) => boolean | EventListenerOptions;
declare const eventOn: (el: Window | Document | Element, evtName: string, handler: EventHandlerNonNull, options?: EventListenerOptions | undefined) => void;
declare const eventOff: (el: Window | Document | Element, evtName: string, handler: EventHandlerNonNull, options?: EventListenerOptions | undefined) => void;
declare const isElement: (el: Element) => boolean;
declare const isVisible: (el: HTMLElement) => boolean;
declare const isDisabled: (el: HTMLInputElement) => boolean;
declare const reflow: (el: HTMLElement) => number | false;
declare const selectAll: (selector: string, root: Element) => Element[];
declare const select: (selector: string, root: Element) => Element | null;
declare const matches: (el: Element, selector: string) => boolean;
declare const closest: (selector: string, root: Element) => Element | null;
declare const contains: (parent: Element, child: Element) => boolean;
declare const getById: (id: string) => HTMLElement | null;
declare const addClass: (el: HTMLElement, className: string) => void;
declare const removeClass: (el: HTMLElement, className: string) => void;
declare const hasClass: (el: HTMLElement, className: string) => boolean;
declare const setAttr: (el: Element, attr: string, value: string) => void;
declare const removeAttr: (el: Element, attr: string) => void;
declare const getAttr: (el: Element, attr: string) => string | null;
declare const hasAttr: (el: Element, attr: string) => boolean | null;
declare const getBCR: (el: Element) => ClientRect | null;
declare const getCS: (el: Element) => CSSStyleDeclaration;
declare const offset: (el: Element) => {
    top: number;
    left: number;
};
declare const position: (el: HTMLElement) => {
    top: number;
    left: number;
};
declare const getTargets: (binding: DirectiveBinding) => string[];
declare const bindTargets: (vnode: VNode, binding: DirectiveBinding, listenTypes: Dict<boolean>, fn: (target: {
    targets: string[];
    vnode: VNode;
}) => void) => string[];
declare const unbindTargets: (vnode: VNode, binding: DirectiveBinding, listenTypes: Dict<boolean>) => void;
export default bindTargets;
export * from 'vue';
export * from 'vue/types/options';
export { ElementClass, Primitive, BooleanLike, NumberLike, Dict, from, isArray, arrayIncludes, concat, assign, getOwnPropertyNames, keys, defineProperties, defineProperty, freeze, getOwnPropertyDescriptor, getOwnPropertySymbols, getPrototypeOf, create, isFrozen, is, isObject, isPlainObject, omit, readonlyDescriptor, deepFreeze, hasOwnProperty, hasWindowSupport, hasDocumentSupport, hasNavigatorSupport, hasPromiseSupport, hasMutationObserverSupport, isBrowser, userAgent, isJSDOM, isIE, hasPassiveEventSupport, hasTouchSupport, hasPointerEventSupport, hasIntersectionObserverSupport, getEnv, getNoWarn, warn, warnNotClient, warnNoPromiseSupport, warnNoMutationObserverSupport, functionalComponent, checkMultipleVue, PropsDef, VueElement, BvInstance, toType, toRawType, toRawTypeLC, isUndefined, isNull, isFunction, isBoolean, isString, isNumber, isPrimitive, isDate, isRegExp, isPromise, isVueElement, matchesEl, closestEl, requestAF, MutationObs, parseEventOptions, eventOn, eventOff, isElement, isVisible, isDisabled, reflow, selectAll, select, matches, closest, contains, getById, addClass, removeClass, hasClass, setAttr, removeAttr, getAttr, hasAttr, getBCR, getCS, offset, position, bindTargets, unbindTargets, getTargets };
