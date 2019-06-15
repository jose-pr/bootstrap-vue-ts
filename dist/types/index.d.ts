import { BvPlugin } from './core/BvPlugin';
import { setConfig } from './core/BvConfig';
import { ComponentsConfig } from './components';
import BVConfigPlugin from './core/ConfigPlugin';
import { PluginFunction } from './utils/vue';
import { BvComponentConfig } from './core/BvComponent';
declare const install: PluginFunction<global.BvConfigOptions>;
declare global {
    type BvConfigOptions = {
        breakpoints?: string[];
    } & ComponentsConfig & BvComponentConfig;
}
export declare type BvConfigOptions = {
    breakpoints?: string[];
} & ComponentsConfig & BvComponentConfig;
export declare const BootstrapVue: BvPlugin;
export default BootstrapVue;
export { BVConfigPlugin, BVConfigPlugin as BVConfig, install, setConfig };
export * from './components';
export * from './directives';
