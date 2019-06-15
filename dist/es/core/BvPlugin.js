import { setConfig } from '../bv-config';
import { hasWindowSupport } from '../utils/env';
import { checkMultipleVue } from '../utils/vue';
/**
 * Plugin install factory function.
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */
export const installFactory = ({ components, directives, plugins }) => {
    const install = (Vue, config = {}) => {
        if (install.installed) {
            /* istanbul ignore next */
            return;
        }
        install.installed = true;
        checkMultipleVue(Vue);
        setConfig(config, Vue);
        registerComponents(Vue, components);
        registerDirectives(Vue, directives);
        registerPlugins(Vue, plugins);
    };
    install.installed = false;
    return install;
};
/**
 * Plugin object factory function.
 * @param {object} { components, directives, plugins }
 * @returns {object} plugin install object
 */
export const pluginFactory = (opts = {}, extend = {}) => {
    return Object.assign({}, extend, { install: installFactory(opts) });
};
/**
 * Load a group of plugins.
 * @param {object} Vue
 * @param {object} Plugin definitions
 */
export const registerPlugins = (Vue, plugins = {}) => {
    for (let plugin in plugins) {
        if (plugin && plugins[plugin]) {
            Vue.use(plugins[plugin]);
        }
    }
};
/**
 * Load a component.
 * @param {object} Vue
 * @param {string} Component name
 * @param {object} Component definition
 */
export const registerComponent = (Vue, name, def) => {
    if (Vue && name && def) {
        Vue.component(name, def);
    }
};
/**
 * Load a group of components.
 * @param {object} Vue
 * @param {object} Object of component definitions
 */
export const registerComponents = (Vue, components = {}) => {
    for (let component in components) {
        registerComponent(Vue, component, components[component]);
    }
};
/**
 * Load a directive.
 * @param {object} Vue
 * @param {string} Directive name
 * @param {object} Directive definition
 */
export const registerDirective = (Vue, name, def) => {
    if (Vue && name && def) {
        // Ensure that any leading V is removed from the
        // name, as Vue adds it automatically
        Vue.directive(name.replace(/^VB/, 'B'), def);
    }
};
/**
 * Load a group of directives.
 * @param {object} Vue
 * @param {object} Object of directive definitions
 */
export const registerDirectives = (Vue, directives = {}) => {
    for (let directive in directives) {
        registerDirective(Vue, directive, directives[directive]);
    }
};
/**
 * Install plugin if window.Vue available
 * @param {object} Plugin definition
 */
export const vueUse = (VuePlugin) => {
    /* istanbul ignore next */
    if (hasWindowSupport && window.Vue) {
        window.Vue.use(VuePlugin);
    }
};
