declare const memoize: <T, R>(fn: (...args: T[]) => R) => (...args: T[]) => R;
export default memoize;
