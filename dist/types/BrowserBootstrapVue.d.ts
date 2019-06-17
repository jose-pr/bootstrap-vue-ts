import BVConfigPlugin from "chunks/bb55e737";
import BootstrapVue from "BootstrapVue";
import { BvPlugin, setConfig } from "chunks/ca461e24";
import { ComponentsConfig } from "chunks/bb55e737";
import { PluginFunction } from "chunks/fbe932e6";
import { BvComponentConfig } from "chunks/04377600";
declare const install: PluginFunction<global.BvConfigOptions>;
declare global {
    type BvConfigOptions = {
        breakpoints?: string[];
    } & ComponentsConfig & BvComponentConfig;
}
declare type BvConfigOptions = {
    breakpoints?: string[];
} & ComponentsConfig & BvComponentConfig;
declare const BootstrapVue: BvPlugin;
export default BootstrapVue;
export { BVConfigPlugin as BVConfig };
export * from "chunks/bb55e737";
export * from "chunks/bb55e737";
export { BVConfigPlugin, install, setConfig };
