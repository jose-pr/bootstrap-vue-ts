import { Dict } from './types'
import { VueExtended, DirectiveBinding, VNode } from './vue'
import { isElement } from './dom'
import { warn } from './warn'
import { isUndefined } from './inspect'
import { isBrowser } from './env'

/*
 * Utility Methods
 */

// Better var type detection
function toType(obj: unknown): string /* istanbul ignore next: not easy to test */ {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)![1]
    .toLowerCase()
}

// Check config properties for expected types
function typeCheckConfig<ConfigType>(
  componentName: string,
  config: ConfigType,
  configTypes: Record<keyof ConfigType, string>
): void /* istanbul ignore next: not easy to test */ {
  for (const property in configTypes) {
    if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
      const expectedTypes = configTypes[property as keyof ConfigType]
      const value = config[property] as unknown
      let valueType = value && isElement(value) ? 'element' : toType(value)
      // handle Vue instances
      valueType = value && (value as VueExtended)._isVue ? 'component' : valueType

      if (!new RegExp(expectedTypes).test(valueType)) {
        /* istanbul ignore next */
        warn(
          `${componentName}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}"`
        )
      }
    }
  }
}

export abstract class Directive<ConfigType> {
  protected ['constructor']!: unknown

  public $element?: HTMLElement
  public $root?: VueExtended
  public $config?: ConfigType
  public $timeouts?: Dict<number | undefined>
  public $intervals?: Dict<number | undefined>

  // Main constructor
  public constructor(element: HTMLElement, config: Partial<ConfigType>, $root?: VueExtended) {
    this.clearProps()
    this.$element = element
    this.$timeouts = {}
    this.$intervals = {}
    this.init()
    this.updateConfig(config, $root)
  }
  init() {}
  static get NAME() {
    return ''
  }

  get name() {
    return (this.constructor as typeof Directive).NAME
  }
  get defaultConfig() {
    return (this.constructor as typeof Directive).DEFAULT as ConfigType
  }

  getStaticProp<T>(name: keyof T) {
    return (this.constructor as T)[name]
  }

  static get DEFAULT(): unknown {
    return {}
  }
  static get DEFAULT_TYPE(): unknown {
    return undefined
  }
  static ParseBindings(bindings: DirectiveBinding): unknown {
    return undefined
  }
  static get ElementHoldingProp() {
    return `__BV_${this.NAME}__`
  }
  static ValidateApply(element: HTMLElement, config: DirectiveBinding, $root?: VNode): boolean {
    return true
  }
  static Dispose(el: HTMLElement) {
    // Remove PopOver on our element
    let current = (el as any)[this.ElementHoldingProp]
    if (current instanceof this) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      current.dispose()
      ;(el as any)[this.ElementHoldingProp] = undefined
      delete (el as any)[this.ElementHoldingProp]
    }
  }

  static Apply(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void {
    if (!isBrowser || !this.call) {
      /* istanbul ignore next */
      return
    }
    let constructor = (this as unknown) as (Directive<unknown> &
      (new (element: HTMLElement, config: Partial<unknown>, $root?: VueExtended) => Directive<
        unknown
      >))

    let name = this.ElementHoldingProp

    if (this.ValidateApply(el, bindings, vnode)) return
    const config = this.ParseBindings(bindings) as unknown
    if (!config) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current = (el as any)[name] as Directive<unknown>
    if (current instanceof Directive) {
      current.updateConfig(config as any)
    } else {
      if (!vnode.context) return // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(el as any)[name] = new constructor(el, config as any, vnode.context.$root as VueExtended)
    }
  }
  preUpdateConfig() {}
  postUpdateConfig() {}

  updateConfig(config: Partial<ConfigType>, $root?: VueExtended): void {
    this.preUpdateConfig()
    this.unListen()
    let constructor = this.constructor as typeof Directive
    const cfg = this.processConfig({ ...(constructor.DEFAULT as ConfigType), ...config })
    if ($root) {
      this.$root = $root
    }
    if (constructor.DEFAULT_TYPE) {
      typeCheckConfig(constructor.NAME, cfg, constructor.DEFAULT_TYPE as Record<
        keyof ConfigType,
        string
      >)
    }
    this.$config = cfg
    this.listen()
    this.postUpdateConfig()
  }

  processConfig(config: ConfigType) {
    return config
  }

  clearProps() {
    let obj = this
    if (this.$timeouts) Object.entries(obj).forEach(([, value]) => clearTimeout(value))
    if (this.$intervals) Object.entries(obj).forEach(([, value]) => clearInterval(value))
    Object.keys(obj).forEach(k => {
      let prop: keyof this = k as keyof this
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        //@ts-ignore
        obj[prop] = undefined
      }
    })
  }

  dispose() {
    this.preDispose()
    this.unListen()
    this.clearProps()
    this.postDispose()
  }
  preDispose() {}
  postDispose() {}
  listen() {}
  unListen() {}

  activeTimeout(name: string): boolean {
    return !isUndefined(this.$timeouts) && !isUndefined(this.$timeouts[name])
  }
  activeInterval(name: string): boolean {
    return !isUndefined(this.$intervals) && !isUndefined(this.$intervals[name])
  }

  setTimeout(name: string, handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
    if (!this.$timeouts) {
      this.$timeouts = {}
    }
    let id = setTimeout(handler, timeout, ...args)
    this.$timeouts[name] = id
    return id
  }
  clearTimeout(name: string) {
    if (!this.$timeouts) {
      return
    }
    clearTimeout(this.$timeouts[name])
  }
  setInterval(name: string, handler: TimerHandler, timeout?: number, ...args: unknown[]): number {
    if (!this.$intervals) {
      this.$intervals = {}
    }
    let id = setInterval(handler, timeout, ...args)
    this.$intervals[name] = id
    return id
  }
  clearInterval(name: string) {
    if (!this.$intervals) {
      return
    }
    clearTimeout(this.$intervals[name])
    this.$intervals[name] = undefined
  }

  static GetBvDirective() {
    let constructor = this
    return {
      bind(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void {
        constructor.Apply(el, bindings, vnode)
      },
      inserted(el: HTMLElement, bindings: DirectiveBinding, vnode: VNode): void {
        constructor.Apply(el, bindings, vnode)
      },
      update(
        el: HTMLElement,
        bindings: DirectiveBinding,
        vnode: VNode
      ): void /* istanbul ignore next: not easy to test */ {
        if (bindings.value !== bindings.oldValue) {
          constructor.Apply(el, bindings, vnode)
        }
      },
      componentUpdated(
        el: HTMLElement,
        bindings: DirectiveBinding,
        vnode: VNode
      ): void /* istanbul ignore next: not easy to test */ {
        if (bindings.value !== bindings.oldValue) {
          constructor.Apply(el, bindings, vnode)
        }
      },
      unbind(el: HTMLElement): void {
        constructor.Dispose(el)
      }
    }
  }
}
