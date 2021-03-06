import { isArray } from './array'
import { isObject } from './object'

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
export const get = <T>(obj: any, path: string, defaultValue: T | null = null) => {
  // Handle array of path values
  path = isArray(path) ? path.join('.') : path

  // If no path or no object passed
  if (!path || !isObject(obj)) {
    return defaultValue
  }

  // Handle edge case where user has dot(s) in top-level item field key
  // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2762
  if (obj.hasOwnProperty(path)) {
    return (obj as any)[path]
  }

  // Handle string array notation (numeric indices only)
  path = String(path).replace(/\[(\d+)]/g, '.$1')

  const steps = path.split('.').filter(Boolean)

  // Handle case where someone passes a string of only dots
  if (steps.length === 0) {
    return defaultValue
  }

  // Traverse path in object to find result
  return steps.every(
    step => isObject(obj) && obj.hasOwnProperty(step) && (obj = (obj as any)[step]) != null
  )
    ? obj
    : defaultValue
}

export default get
