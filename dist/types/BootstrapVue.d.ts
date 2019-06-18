import BVConfigPlugin from "chunks/6ebfe45c";
import { BvPlugin, setConfig } from "chunks/dafa5b20";
import { ComponentsConfig } from "chunks/6ebfe45c";
import { PluginFunction } from "chunks/5cd47ea1";
import { BvComponentConfig } from "chunks/87e3debe";
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
export { BVConfigPlugin as BVConfig };
export * from "chunks/6ebfe45c";
export * from "chunks/6ebfe45c";
export { BVConfigPlugin, install, setConfig };
