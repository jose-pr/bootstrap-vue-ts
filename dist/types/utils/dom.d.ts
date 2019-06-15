export declare const matchesEl: (selectors: string) => boolean;
export declare const closestEl: {
    <K extends "object" | "link" | "small" | "sub" | "sup" | "track" | "progress" | "a" | "abbr" | "address" | "applet" | "area" | "article" | "aside" | "audio" | "b" | "base" | "basefont" | "bdi" | "bdo" | "blockquote" | "body" | "br" | "button" | "canvas" | "caption" | "cite" | "code" | "col" | "colgroup" | "data" | "datalist" | "dd" | "del" | "details" | "dfn" | "dialog" | "dir" | "div" | "dl" | "dt" | "em" | "embed" | "fieldset" | "figcaption" | "figure" | "font" | "footer" | "form" | "frame" | "frameset" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "head" | "header" | "hgroup" | "hr" | "html" | "i" | "iframe" | "img" | "input" | "ins" | "kbd" | "label" | "legend" | "li" | "main" | "map" | "mark" | "marquee" | "menu" | "meta" | "meter" | "nav" | "noscript" | "ol" | "optgroup" | "option" | "output" | "p" | "param" | "picture" | "pre" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "script" | "section" | "select" | "slot" | "source" | "span" | "strong" | "style" | "summary" | "table" | "tbody" | "td" | "template" | "textarea" | "tfoot" | "th" | "thead" | "time" | "title" | "tr" | "u" | "ul" | "var" | "video" | "wbr">(selector: K): HTMLElementTagNameMap[K] | null;
    <K extends "symbol" | "a" | "script" | "style" | "title" | "circle" | "clipPath" | "defs" | "desc" | "ellipse" | "feBlend" | "feColorMatrix" | "feComponentTransfer" | "feComposite" | "feConvolveMatrix" | "feDiffuseLighting" | "feDisplacementMap" | "feDistantLight" | "feFlood" | "feFuncA" | "feFuncB" | "feFuncG" | "feFuncR" | "feGaussianBlur" | "feImage" | "feMerge" | "feMergeNode" | "feMorphology" | "feOffset" | "fePointLight" | "feSpecularLighting" | "feSpotLight" | "feTile" | "feTurbulence" | "filter" | "foreignObject" | "g" | "image" | "line" | "linearGradient" | "marker" | "mask" | "metadata" | "path" | "pattern" | "polygon" | "polyline" | "radialGradient" | "rect" | "stop" | "svg" | "switch" | "text" | "textPath" | "tspan" | "use" | "view">(selector: K): SVGElementTagNameMap[K] | null;
    (selector: string): Element | null;
};
export declare const requestAF: (callback: FrameRequestCallback) => number;
export declare const MutationObs: MutationObs;
interface MutationObs {
    new (callback: MutationCallback): MutationObserver;
}
export declare const parseEventOptions: (options?: boolean | EventListenerOptions | undefined) => boolean | EventListenerOptions;
export declare const eventOn: (el: Element | Window | Document, evtName: string, handler: EventHandlerNonNull, options?: EventListenerOptions | undefined) => void;
export declare const eventOff: (el: Element | Window | Document, evtName: string, handler: EventHandlerNonNull, options?: EventListenerOptions | undefined) => void;
export declare const isElement: (el: Element) => boolean;
export declare const isVisible: (el: HTMLElement) => boolean;
export declare const isDisabled: (el: HTMLInputElement) => boolean;
export declare const reflow: (el: HTMLElement) => number | false;
export declare const selectAll: (selector: string, root: Element) => Element[];
export declare const select: (selector: string, root: Element) => Element | null;
export declare const matches: (el: Element, selector: string) => boolean;
export declare const closest: (selector: string, root: Element) => Element | null;
export declare const contains: (parent: Element, child: Element) => boolean;
export declare const getById: (id: string) => HTMLElement | null;
export declare const addClass: (el: HTMLElement, className: string) => void;
export declare const removeClass: (el: HTMLElement, className: string) => void;
export declare const hasClass: (el: HTMLElement, className: string) => boolean;
export declare const setAttr: (el: Element, attr: string, value: string) => void;
export declare const removeAttr: (el: Element, attr: string) => void;
export declare const getAttr: (el: Element, attr: string) => string | null;
export declare const hasAttr: (el: Element, attr: string) => boolean | null;
export declare const getBCR: (el: Element) => ClientRect | null;
export declare const getCS: (el: Element) => CSSStyleDeclaration;
export declare const offset: (el: Element) => {
    top: number;
    left: number;
};
export declare const position: (el: HTMLElement) => {
    top: number;
    left: number;
};
export {};
