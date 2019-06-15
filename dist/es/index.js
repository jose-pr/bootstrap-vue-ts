import { installFactory } from './core/BvPlugin';
import { setConfig } from './bv-config';
import { componentsPlugin } from './components';
import { directivesPlugin } from './directives';
import BVConfigPlugin from './core/ConfigPlugin';
// BootstrapVue installer
const install = installFactory({ plugins: { componentsPlugin, directivesPlugin } });
export const BootstrapVue = {
    install: install,
    setConfig: setConfig
};
export default BootstrapVue;
// Named exports for BvConfigPlugin and BootstrapVue
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
setConfig };
// Components/Plugins
export * from './components';
// Directives/Plugins
export * from './directives';
