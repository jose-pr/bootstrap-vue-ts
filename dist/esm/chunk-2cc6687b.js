import { O as OurVue, a as isPlainObject, h as hasOwnProperty, w as warn, i as isArray, f as isString, c as isUndefined, g as getOwnPropertyNames, j as checkMultipleVue } from './chunk-f3e511bd.js';
import { B as BV_CONFIG_PROP_NAME, D as DEFAULTS, c as cloneDeep, g as get } from './chunk-efcf0387.js';
import './chunk-2cd43649.js';

// --- Constants ---
// Config manager class
class BvConfig {
    constructor() {
        // TODO: pre-populate with default config values (needs updated tests)
        // this.$_config = cloneDeep(DEFAULTS)
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.$_config = {};
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.$_cachedBreakpoints = null;
    }
    static get Defaults() {
        return DEFAULTS;
    }
    get defaults() {
        return DEFAULTS;
    }
    // Returns the defaults
    getDefaults() {
        return this.defaults;
    }
    // Method to merge in user config parameters
    setConfig(config = {}) {
        if (!isPlainObject(config)) {
            /* istanbul ignore next */
            return;
        }
        const configKeys = getOwnPropertyNames(config);
        for (let cmpName of configKeys) {
            /* istanbul ignore next */
            if (!hasOwnProperty(DEFAULTS, cmpName)) {
                warn(`config: unknown config property "${cmpName}"`);
                return;
            }
            const cmpConfig = config[cmpName];
            if (cmpName === 'breakpoints') {
                // Special case for breakpoints
                const breakpoints = config.breakpoints;
                /* istanbul ignore if */
                if (!isArray(breakpoints) ||
                    breakpoints.length < 2 ||
                    breakpoints.some(b => !isString(b) || b.length === 0)) {
                    warn('config: "breakpoints" must be an array of at least 2 breakpoint names');
                }
                else {
                    this.$_config.breakpoints = cloneDeep(breakpoints);
                }
            }
            else if (isPlainObject(cmpConfig)) {
                // Component prop defaults
                let config = cmpConfig;
                const props = getOwnPropertyNames(cmpConfig);
                for (let prop of props) {
                    /* istanbul ignore if */
                    if (!hasOwnProperty(DEFAULTS[cmpName], prop)) {
                        warn(`config: unknown config property "${cmpName}.{$prop}"`);
                    }
                    else {
                        // TODO: If we pre-populate the config with defaults, we can skip this line
                        this.$_config[cmpName] = this.$_config[cmpName] || {};
                        if (!isUndefined(cmpConfig[prop])) {
                            this.$_config[cmpName][prop] = cloneDeep(config[prop]);
                        }
                    }
                }
            }
        }
    }
    // Clear the config. For testing purposes only
    resetConfig() {
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.$_config = {};
    }
    // Returns a deep copy of the user config
    getConfig() {
        return cloneDeep(this.$_config);
    }
    getConfigValue(key) {
        // First we try the user config, and if key not found we fall back to default value
        // NOTE: If we deep clone DEFAULTS into config, then we can skip the fallback for get
        return cloneDeep(get(this.$_config, key, get(DEFAULTS, key)));
    }
}
// Method for applying a global config
const setConfig = (config = {}, Vue = OurVue) => {
    // Ensure we have a $bvConfig Object on the Vue prototype.
    // We set on Vue and OurVue just in case consumer has not set an alias of `vue`.
    Vue.prototype[BV_CONFIG_PROP_NAME] = OurVue.prototype[BV_CONFIG_PROP_NAME] =
        Vue.prototype[BV_CONFIG_PROP_NAME] || OurVue.prototype[BV_CONFIG_PROP_NAME] || new BvConfig();
    // Apply the config values
    Vue.prototype[BV_CONFIG_PROP_NAME].setConfig(config);
};

/**
 * Load a group of plugins.
 * @param {object} Vue
 * @param {object} Plugin definitions
 */
const registerPlugins = (Vue, plugins = {}) => {
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
const registerComponent = (Vue, name, def) => {
    if (Vue && name && def) {
        Vue.component(name, def);
    }
};
/**
 * Load a group of components.
 * @param {object} Vue
 * @param {object} Object of component definitions
 */
const registerComponents = (Vue, components = {}) => {
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
const registerDirective = (Vue, name, def) => {
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
const registerDirectives = (Vue, directives = {}) => {
    for (let directive in directives) {
        registerDirective(Vue, directive, directives[directive]);
    }
};
/**
 * Plugin install factory function.
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */
const installFactory = ({ components, directives, plugins }) => {
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
const pluginFactory = (opts = {}, extend = {}) => {
    return Object.assign({}, extend, { install: installFactory(opts) });
};

export { installFactory as i, pluginFactory as p, setConfig as s };
