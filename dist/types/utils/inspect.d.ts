/**
 * Convenience inspection utilities
 */
import { VueElement } from './vue';
export declare const toType: (val: any) => "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
export declare const toRawType: (val: any) => string;
export declare const toRawTypeLC: (val: any) => string;
export declare const isUndefined: (val: any) => val is undefined;
export declare const isNull: (val: any) => val is null;
export declare const isFunction: (val: any) => val is Function;
export declare const isBoolean: (val: any) => val is boolean;
export declare const isString: (val: any) => val is string;
export declare const isNumber: (val: any) => val is number;
export declare const isPrimitive: (val: any) => val is string | number | boolean;
export declare const isDate: (val: any) => val is Date;
export declare const isRegExp: (val: any) => val is RegExp;
export declare const isPromise: (val: any) => val is Promise<any>;
export declare const isVueElement: (val: any) => val is VueElement;
