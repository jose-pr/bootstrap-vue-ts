/*
 * Consistent and stable sort function across JavaScript platforms
 *
 * Inconsistent sorts can cause SSR problems between client and server
 * such as in <b-table> if sortBy is applied to the data on server side render.
 * Chrome and V8 native sorts are inconsistent/unstable
 *
 * This function uses native sort with fallback to index compare when the a and b
 * compare returns 0
 *
 * Algorithm based on:
 * https://stackoverflow.com/questions/1427608/fast-stable-sorting-algorithm-implementation-in-javascript/45422645#45422645
 *
 * @param {array} array to sort
 * @param {function} sort compare function
 * @return {array}
 */
export const stableSort = <T = unknown>(array: T[], compareFn: (a: T, b: T) => number) => {
  // Using `.bind(compareFn)` on the wrapped anonymous function improves
  // performance by avoiding the function call setup. We don't use an arrow
  // function here as it binds `this` to the `stableSort` context rather than
  // the `compareFn` context, which wouldn't give us the performance increase.
  interface CompArr {
    [0]: number
    [1]: T
  }
  return array
    .map((a, index) => [index, a] as CompArr)
    .sort(
      function(this: (a: T, b: T) => number, a: CompArr, b: CompArr) {
        return this(a[1] as T, b[1] as T) || (a[0] as number) - b[0]
      }.bind(compareFn)
    )
    .map(e => e[1])
}

export default stableSort
