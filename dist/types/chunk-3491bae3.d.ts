import OurVue from "chunk-1bdb7d0e";
import { VueConstructor, DirectiveOptions, DirectiveFunction, PluginObject, PluginFunction, Dict } from "chunk-1bdb7d0e";
import { BvComponent } from "chunk-39591e18";
declare class BvConfig {
    private $_config;
    private $_cachedBreakpoints;
    constructor();
    static readonly Defaults: BvConfigOptions;
    private readonly defaults;
    getDefaults(): BvConfigOptions;
    setConfig(config?: BvConfigOptions): void;
    resetConfig(): void;
    getConfig(): BvConfigOptions;
    getConfigValue(key: string): BvConfigOptions;
}
declare const setConfig: (config?: {}, Vue?: import("vue/types/vue").VueConstructor<OurVue>) => void;
declare const resetConfig: () => void;
export interface BvPlugin extends PluginObject<BvConfigOptions> {
    install: PluginFunction<BvConfigOptions>;
}
interface FactoryOptions {
    components?: Dict<BvComponent>;
    directives?: Dict<DirectiveOptions | DirectiveFunction>;
    plugins?: Dict<BvPlugin>;
}
/**
 * Load a group of plugins.
 * @param {object} Vue
 * @param {object} Plugin definitions
 */
export declare const registerPlugins: (Vue: VueConstructor<import("vue/types/vue").Vue>, plugins?: Dict<BvPlugin>) => void;
/**
 * Load a component.
 * @param {object} Vue
 * @param {string} Component name
 * @param {object} Component definition
 */
export declare const registerComponent: (Vue: VueConstructor<import("vue/types/vue").Vue>, name: string, def: BvComponent) => void;
/**
 * Load a group of components.
 * @param {object} Vue
 * @param {object} Object of component definitions
 */
export declare const registerComponents: (Vue: VueConstructor<import("vue/types/vue").Vue>, components?: Dict<BvComponent>) => void;
/**
 * Load a directive.
 * @param {object} Vue
 * @param {string} Directive name
 * @param {object} Directive definition
 */
export declare const registerDirective: (Vue: VueConstructor<import("vue/types/vue").Vue>, name: string, def: DirectiveOptions | DirectiveFunction) => void;
/**
 * Load a group of directives.
 * @param {object} Vue
 * @param {object} Object of directive definitions
 */
export declare const registerDirectives: (Vue: VueConstructor<import("vue/types/vue").Vue>, directives?: Dict<DirectiveOptions | DirectiveFunction>) => void;
/**
 * Plugin install factory function.
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */
export declare const installFactory: ({ components, directives, plugins }: FactoryOptions) => PluginFunction<any>;
/**
 * Plugin object factory function.
 * @param {object} { components, directives, plugins }
 * @returns {object} plugin install object
 */
export declare const pluginFactory: (opts?: FactoryOptions, extend?: {}) => BvPlugin;
/**
 * Install plugin if window.Vue available
 * @param {object} Plugin definition
 */
export declare const vueUse: (VuePlugin: BvPlugin) => void;
export { BvConfig, setConfig, resetConfig };
