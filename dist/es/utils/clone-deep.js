import { keys, isPlainObject } from './object';
import { isArray } from './array';
export const cloneDeep = (obj, defaultValue = obj) => {
    if (isArray(obj)) {
        return obj.reduce((result, val) => [...result, cloneDeep(val, val)], []);
    }
    if (isPlainObject(obj)) {
        return keys(obj).reduce((result, key) => (Object.assign({}, result, { [key]: cloneDeep(obj[key], obj[key]) })), {});
    }
    return defaultValue;
};
export default cloneDeep;
