import { isNull, isUndefined } from './inspect'
import { isArray } from './array'
import { isPlainObject } from './object'

/**
 * Convert a value to a string that can be rendered.
 */
export const toString = (val: any, spaces = 2): string => {
  return isUndefined(val) || isNull(val)
    ? ''
    : isArray(val) || (isPlainObject(val) && val.toString === Object.prototype.toString)
    ? JSON.stringify(val, null, spaces)
    : String(val)
}
export default toString
