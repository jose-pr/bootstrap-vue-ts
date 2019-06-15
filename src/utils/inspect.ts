/**
 * Convenience inspection utilities
 */

import { isArray } from './array'
import { isObject, isPlainObject } from './object'
import { Primitive, VueElement } from './types';

export const toType = (val:any) => typeof val

export const toRawType = (val:any) => Object.prototype.toString.call(val).slice(8, -1)

export const toRawTypeLC = (val:any) => toRawType(val).toLowerCase()

export const isUndefined = (val:any): val is undefined => val === undefined

export const isNull = (val:any): val is null => val === null

export const isFunction = (val:any): val is Function => toType(val) === 'function'

export const isBoolean = (val:any): val is boolean => toType(val) === 'boolean'

export const isString = (val:any): val is string => toType(val) === 'string'

export const isNumber = (val:any): val is number => toType(val) === 'number'

export const isPrimitive = (val:any): val is Primitive => isBoolean(val) || isString(val) || isNumber(val)

export const isDate = (val:any): val is Date => val instanceof Date

export const isRegExp = (val:any): val is RegExp => toRawType(val) === 'RegExp'

export const isPromise = (val:any): val is Promise<any> =>
  !isUndefined(val) && !isNull(val) && isFunction(val.then) && isFunction(val.catch)

export const isVueElement = (val:any): val is VueElement => val.__vue__&& val instanceof HTMLElement

// Extra convenience named re-exports
export { isArray, isObject, isPlainObject }
