import { create } from './object'

const memoize = <T,R>(fn:(...args:T[])=>R) => {
  const cache = create(null)

  return (...args:T[]) => {
    const argsKey = JSON.stringify(args)
    return (cache[argsKey] = cache[argsKey] || fn.apply(null, args)) as R
  }
}

export default memoize