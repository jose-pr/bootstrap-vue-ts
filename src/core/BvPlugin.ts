import { setConfig } from './BvConfig'
import { hasWindowSupport } from '../utils/env'
import {
  VueConstructor,
  DirectiveOptions,
  DirectiveFunction,
  PluginObject,
  PluginFunction,
  checkMultipleVue
} from '../utils/vue'
import { Dict } from '../utils/types'
import { BvComponent } from './BvComponent'

export interface BvPlugin extends PluginObject<BvConfigOptions> {
  install: PluginFunction<BvConfigOptions>
}

interface FactoryOptions {
  components?: Dict<BvComponent>
  directives?: Dict<DirectiveOptions | DirectiveFunction>
  plugins?: Dict<BvPlugin>
}

/**
 * Load a group of plugins.
 * @param {object} Vue
 * @param {object} Plugin definitions
 */
export const registerPlugins = (Vue: VueConstructor, plugins: Dict<BvPlugin> = {}): void => {
  for (let plugin in plugins) {
    if (plugin && plugins[plugin]) {
      Vue.use(plugins[plugin])
    }
  }
}

/**
 * Load a component.
 * @param {object} Vue
 * @param {string} Component name
 * @param {object} Component definition
 */

export const registerComponent = (Vue: VueConstructor, name: string, def: BvComponent): void => {
  if (Vue && name && def) {
    Vue.component(name, def)
  }
}

/**
 * Load a group of components.
 * @param {object} Vue
 * @param {object} Object of component definitions
 */
export const registerComponents = (
  Vue: VueConstructor,
  components: Dict<BvComponent> = {}
): void => {
  for (let component in components) {
    registerComponent(Vue, component, components[component])
  }
}

/**
 * Load a directive.
 * @param {object} Vue
 * @param {string} Directive name
 * @param {object} Directive definition
 */
export const registerDirective = (
  Vue: VueConstructor,
  name: string,
  def: DirectiveOptions | DirectiveFunction
): void => {
  if (Vue && name && def) {
    // Ensure that any leading V is removed from the
    // name, as Vue adds it automatically
    Vue.directive(name.replace(/^VB/, 'B'), def)
  }
}

/**
 * Load a group of directives.
 * @param {object} Vue
 * @param {object} Object of directive definitions
 */
export const registerDirectives = (
  Vue: VueConstructor,
  directives: Dict<DirectiveOptions | DirectiveFunction> = {}
): void => {
  for (let directive in directives) {
    registerDirective(Vue, directive, directives[directive])
  }
}

/**
 * Plugin install factory function.
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */
export const installFactory = ({
  components,
  directives,
  plugins
}: FactoryOptions): PluginFunction<BvConfigOptions> => {
  const install = (Vue: VueConstructor, config = {}): void => {
    if (install.installed) {
      /* istanbul ignore next */
      return
    }
    install.installed = true
    checkMultipleVue(Vue)
    setConfig(config, Vue)
    registerComponents(Vue, components)
    registerDirectives(Vue, directives)
    registerPlugins(Vue, plugins)
  }

  install.installed = false

  return install
}

/**
 * Plugin object factory function.
 * @param {object} { components, directives, plugins }
 * @returns {object} plugin install object
 */
export const pluginFactory = (opts: FactoryOptions = {}, extend = {}): BvPlugin => {
  return {
    ...extend,
    install: installFactory(opts)
  }
}

/**
 * Install plugin if window.Vue available
 * @param {object} Plugin definition
 */
export const vueUse = (VuePlugin: BvPlugin): void => {
  /* istanbul ignore next */
  if (hasWindowSupport && ((window as unknown) as { Vue: VueConstructor }).Vue) {
    ;((window as unknown) as { Vue: VueConstructor }).Vue.use(VuePlugin)
  }
}
