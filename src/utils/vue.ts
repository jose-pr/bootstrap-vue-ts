/* eslint-disable @typescript-eslint/explicit-function-return-type */
import OurVue, { FunctionalComponentOptions, VueConstructor } from 'vue'
import { PropOptions, RecordPropsDefinition } from 'vue/types/options'

import { Dict } from './types'
import { warn } from './warn'
import { isJSDOM } from './env'

//
// Single point of contact for Vue
//
// TODO:
//   Conditionally import Vue if no global Vue
//
export const Vue = OurVue as VueConstructor<Vue>
export { Component, Watch, Prop, Mixins } from 'vue-property-decorator'
export * from 'vue'
export * from 'vue/types/options'
export * from 'vue/types/vnode'
export function functionalComponent<Props>(
  options: Omit<FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>, 'functional'> & {
    methods?: Dict<Function>
  }
) {
  return Vue.extend<Props>({
    ...options,
    functional: true
  })
}
/**
 * Checks if there are multiple instances of Vue, and warns (once) about possible issues.
 * @param {object} Vue
 */
export const checkMultipleVue = (() => {
  let checkMultipleVueWarned = false

  const MULTIPLE_VUE_WARNING = [
    'Multiple instances of Vue detected!',
    'You may need to set up an alias for Vue in your bundler config.',
    'See: https://bootstrap-vue.js.org/docs#using-module-bundlers'
  ].join('\n')

  return (Vue: VueConstructor) => {
    /* istanbul ignore next */
    if (!checkMultipleVueWarned && OurVue !== Vue && !isJSDOM) {
      warn(MULTIPLE_VUE_WARNING)
    }
    checkMultipleVueWarned = true
  }
})()
export type PropsDef<T> = {
  [k in keyof T]: PropOptions
}

export interface VueElement extends HTMLElement {
  __vue__: OurVue
}
export interface Vue extends OurVue {
  $el: HTMLElement
  $parent: Vue
  $route?: unknown
  _isVue: boolean
  _uid: string
}

export interface BvInstance {
  readonly $bvModal?: BvInstance
  readonly $bvTotal?: BvInstance
}
