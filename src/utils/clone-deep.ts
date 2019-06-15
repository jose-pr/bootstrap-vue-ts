import { isArray, isPlainObject } from './inspect'
import { keys } from './object'

export const cloneDeep = <T>(obj:T, defaultValue:T = obj):T => {
  if (isArray(obj)) {
    return obj.reduce((result, val) => [...result, cloneDeep(val, val)], [])
  }
  if (isPlainObject(obj)) {
    return keys(obj).reduce<T>(
      (result, key) => ({ ...result, [key]: cloneDeep((obj as any)[key], (obj as any)[key]) }),
      {} as T
    )
  }
  return defaultValue
}

export default cloneDeep
