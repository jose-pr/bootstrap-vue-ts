import { PluginFunction } from './utils/vue';
import { BvConfigOptions } from './bv-config';
import { BvPlugin, installFactory } from './common/BvPlugin';
import { setConfig } from './utils/config';
import { componentsPlugin } from './components'
import { directivesPlugin } from './directives'

// BootstrapVue installer
const install = installFactory({ plugins: { componentsPlugin, directivesPlugin } })

export const BootstrapVue:BvPlugin = {
    install: install as PluginFunction<BvConfigOptions>,
    setConfig: setConfig
}



export default BootstrapVue

export * from './bv-config'

// Components/Plugins
export * from './components'

// Directives/Plugins
export * from './directives'