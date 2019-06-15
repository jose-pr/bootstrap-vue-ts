import Vue, { PropOptions } from 'vue'
import { BvConfig } from '../bv-config';

export type ElementClass = string | string[]
export type Primitive = string | boolean | number
export type BooleanLike = string | boolean | number
export type NumberLike = string | number

export interface Dict<T> {
    [key: string]: T
}

export type PropsDef<T> = {
    [k in keyof T]: PropOptions
}

export interface VueElement extends HTMLElement {
    __vue__:Vue
}

export interface BootstrapVueInstance {
    readonly $bvModal?: BootstrapVueInstance
    readonly $bvTotal?: BootstrapVueInstance
    readonly $_config?: BvConfig
    readonly $_cachedBreakpoints?:string[]|null
}
