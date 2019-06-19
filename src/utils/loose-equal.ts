import { keys, isObject } from './object'
import { isDate } from './inspect'
import { isArray } from './array'

// Assumes both a and b are arrays!
// Handles when arrays are "sparse" (array.every(...) doesn't handle sparse)
const compareArrays = (a: [], b: []): boolean => {
  if (a.length !== b.length) {
    return false
  }
  let equal = true
  for (let i = 0; equal && i < a.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    equal = looseEqual(a[i], b[i])
  }
  return equal
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 * Returns boolean true or false
 */
export const looseEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true
  }
  let aValidType = isDate(a)
  let bValidType = isDate(b)
  if (aValidType || bValidType) {
    return aValidType && bValidType ? (a as Date).getTime() === (b as Date).getTime() : false
  }
  aValidType = isArray(a)
  bValidType = isArray(b)
  if (aValidType || bValidType) {
    return aValidType && bValidType ? compareArrays(a as [], b as []) : false
  }
  aValidType = isObject(a)
  bValidType = isObject(b)
  if (aValidType || bValidType) {
    /* istanbul ignore if: this if will probably never be called */
    if (!aValidType || !bValidType) {
      return false
    }
    const aKeysCount = keys(a).length
    const bKeysCount = keys(b).length
    if (aKeysCount !== bKeysCount) {
      return false
    }
    for (const key in a as {}) {
      const aHasKey = (a as {}).hasOwnProperty(key)
      const bHasKey = (b as {}).hasOwnProperty(key)
      if (
        (aHasKey && !bHasKey) ||
        (!aHasKey && bHasKey) ||
        !looseEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
      ) {
        return false
      }
    }
  }
  return String(a) === String(b)
}

export default looseEqual
