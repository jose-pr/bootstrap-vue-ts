import { Dict } from "f3e511bd";
declare const cloneDeep: <T>(obj: T, defaultValue?: T) => T;
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
declare const TestNever1: () => string;
declare const TestNever2: () => string;
declare const TestNever3: () => string;
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
export * from "f3e511bd";
export * from "efcf0387";
export * from "efcf0387";
export * from "f3e511bd";
export * from "f3e511bd";
export * from "efcf0387";
export * from "f3e511bd";
export * from "efcf0387";
export * from "efcf0387";
export * from "f3e511bd";
export * from "efcf0387";
export * from "efcf0387";
export * from "f3e511bd";
export * from "efcf0387";
export * from "f3e511bd";
export * from "f3e511bd";
export * from "f3e511bd";
export { cloneDeep, get, BV_CONFIG_PROP_NAME, memoize, getConfig, getConfigValue, getComponentConfig, getBreakpoints, getBreakpointsCached, getBreakpointsUp, getBreakpointsUpCached, getBreakpointsDown, getBreakpointsDownCached, TestNever1, TestNever2, TestNever3, TestPartial1, TestPartial2, TestPartial3, toString, stringifyQueryObj, parseQuery, isRouterLink, computeTag, computeRel, computeHref };
