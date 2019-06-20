export type ElementClass = string | string[] | Dict<boolean>
export type Primitive = string | boolean | number
export type BooleanLike = string | boolean | number
export type NumberLike = string | number

export interface Dict<T> {
  [key: string]: T
}
