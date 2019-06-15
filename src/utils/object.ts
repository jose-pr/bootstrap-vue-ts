//@ts-ignore
import assignPolyfill from 'core-js/features/object/assign'
//@ts-ignore
import isPolyfill from 'core-js/features/object/is'
import { Dict } from './types';

// --- Static ---

export const assign = Object.assign || assignPolyfill
export const getOwnPropertyNames = Object.getOwnPropertyNames
export const keys = Object.keys
export const defineProperties = Object.defineProperties
export const defineProperty = Object.defineProperty
export const freeze = Object.freeze
export const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
export const getOwnPropertySymbols = Object.getOwnPropertySymbols
export const getPrototypeOf = Object.getPrototypeOf
export const create = Object.create
export const isFrozen = Object.isFrozen
export const is = Object.is || isPolyfill

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 * Note object could be a complex type like array, date, etc.
 */
export const isObject =  (obj:any): obj is Dict<any> => obj !== null && typeof obj === 'object'

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export const isPlainObject = (obj:any) => Object.prototype.toString.call(obj) === '[object Object]'

//type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// @link https://gist.github.com/bisubus/2da8af7e801ffd813fab7ac221aa7afc
export const omit = <I extends Dict<any>,R>(obj:I, props:string[]):Omit<I,keyof R> =>
  keys(obj)
    .filter(key => props.indexOf(key) === -1)
    .reduce((result, key) => ({ ...result, [key]: obj[key] }), {}) as any

export const readonlyDescriptor = ():PropertyDescriptor => ({ enumerable: true, configurable: false, writable: false })