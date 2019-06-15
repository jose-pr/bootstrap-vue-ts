import { installFactory, BvPlugin } from './core/BvPlugin'
import { setConfig } from './core/BvConfig'
import { componentsPlugin, ComponentsConfig } from './components'
import { directivesPlugin } from './directives'
import BVConfigPlugin from './core/ConfigPlugin'
import { PluginFunction } from './utils/vue'
import { BvComponentConfig } from './core/BvComponent'

// BootstrapVue installer
const install = installFactory({ plugins: { componentsPlugin, directivesPlugin } })

declare global {
  type BvConfigOptions = { breakpoints?: string[] } & ComponentsConfig & BvComponentConfig
}

export type BvConfigOptions = { breakpoints?: string[] } & ComponentsConfig & BvComponentConfig

export const BootstrapVue: BvPlugin = {
  install: install as PluginFunction<BvConfigOptions>,
  setConfig: setConfig
}
export default BootstrapVue // Named exports for BvConfigPlugin and BootstrapVue
export {
  // BV Config Plugin
  BVConfigPlugin,
  // BVConfigPlugin has been documented as BVConfig as well,
  // so we add an alias to the shorter name for backwards compat
  BVConfigPlugin as BVConfig,
  // Installer and setConfig exported in case the consumer does not
  // import `default` as the plugin in CommonJS build (or does not
  // have interop enabled for CommonJS). Both the following will work:
  //   BootstrapVue = require('bootstrap-vue')
  //   BootstrapVue = require('bootstrap-vue').default
  //   Vue.use(BootstrapVue)
  install,
  // To be deprecated. not documented
  setConfig
}

// Components/Plugins
export * from './components'

// Directives/Plugins
export * from './directives'
