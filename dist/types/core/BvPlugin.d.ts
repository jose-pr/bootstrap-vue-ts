import { VueConstructor, DirectiveOptions, DirectiveFunction, PluginObject, PluginFunction } from '../utils/vue';
import { Dict } from '../utils/types';
import { BvComponent } from './BvComponent';
export interface BvPlugin extends PluginObject<BvConfigOptions> {
    install: PluginFunction<BvConfigOptions>;
}
declare type factoryOptions = {
    components?: Dict<BvComponent>;
    directives?: Dict<DirectiveOptions | DirectiveFunction>;
    plugins?: Dict<BvPlugin>;
};
/**
 * Plugin install factory function.
 * @param {object} { components, directives }
 * @returns {function} plugin install function
 */
export declare const installFactory: ({ components, directives, plugins }: factoryOptions) => {
    (Vue: VueConstructor<import("vue/types/vue").Vue>, config?: {}): void;
    installed: boolean;
};
/**
 * Plugin object factory function.
 * @param {object} { components, directives, plugins }
 * @returns {object} plugin install object
 */
export declare const pluginFactory: (opts?: factoryOptions, extend?: {}) => BvPlugin;
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
export declare const registerDirective: (Vue: VueConstructor<import("vue/types/vue").Vue>, name: string, def: DirectiveFunction | DirectiveOptions) => void;
/**
 * Load a group of directives.
 * @param {object} Vue
 * @param {object} Object of directive definitions
 */
export declare const registerDirectives: (Vue: VueConstructor<import("vue/types/vue").Vue>, directives?: Dict<DirectiveFunction | DirectiveOptions>) => void;
/**
 * Install plugin if window.Vue available
 * @param {object} Plugin definition
 */
export declare const vueUse: (VuePlugin: BvPlugin) => void;
export {};
