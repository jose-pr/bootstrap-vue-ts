import { BvPlugin } from './core/BvPlugin';
import { setConfig } from './bv-config';
import { ComponentsConfig } from './components';
import BVConfigPlugin from './core/ConfigPlugin';
import { BvComponentConfig } from './core/BvComponent';
declare const install: {
    (Vue: import("vue/types/vue").VueConstructor<import("vue/types/vue").Vue>, config?: {}): void;
    installed: boolean;
};
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
