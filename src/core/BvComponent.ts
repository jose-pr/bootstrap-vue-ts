import { Primitive, Dict } from '../utils'

export type BvComponentConfig = Dict<
  Primitive | Dict<Primitive | null | undefined> | Primitive[] | null | undefined
>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BvComponent {}
