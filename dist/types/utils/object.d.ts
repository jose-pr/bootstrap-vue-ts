import { Dict } from './types';
export declare const assign: {
    <T, U>(target: T, source: U): T & U;
    <T, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
export declare const getOwnPropertyNames: (o: any) => string[];
export declare const keys: {
    (o: object): string[];
    (o: {}): string[];
};
export declare const defineProperties: (o: any, properties: PropertyDescriptorMap & ThisType<any>) => any;
export declare const defineProperty: (o: any, p: string | number | symbol, attributes: PropertyDescriptor & ThisType<any>) => any;
export declare const freeze: {
    <T>(a: T[]): readonly T[];
    <T extends Function>(f: T): T;
    <T>(o: T): Readonly<T>;
};
export declare const getOwnPropertyDescriptor: (o: any, p: string | number | symbol) => PropertyDescriptor | undefined;
export declare const getOwnPropertySymbols: (o: any) => symbol[];
export declare const getPrototypeOf: (o: any) => any;
export declare const create: {
    (o: object | null): any;
    (o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
};
export declare const isFrozen: (o: any) => boolean;
export declare const is: (value1: any, value2: any) => boolean;
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 * Note object could be a complex type like array, date, etc.
 */
export declare const isObject: (obj: any) => obj is Dict<any>;
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export declare const isPlainObject: (obj: any) => obj is Dict<any>;
export declare const omit: <I extends Dict<any>, R>(obj: I, props: string[]) => Pick<I, Exclude<keyof I, keyof R>>;
export declare const readonlyDescriptor: () => PropertyDescriptor;
/**
 * Deep-freezes and object, making it immutable / read-only.
 * Returns the same object passed-in, but frozen.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
export declare const deepFreeze: <T>(obj: T) => Readonly<T>;
export declare const hasOwnProperty: (obj: any, prop: string) => boolean;
