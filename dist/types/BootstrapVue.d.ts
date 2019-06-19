import BVConfigPlugin from "chunks/c6faf9c8";
import { BvPlugin, setConfig } from "chunks/d4da053b";
import { ComponentsConfig } from "chunks/c6faf9c8";
import { PluginFunction } from "chunks/a6dd0dc4";
import { BvComponentConfig } from "chunks/224339a2";
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
export * from "chunks/c6faf9c8";
export * from "chunks/c6faf9c8";
export { BVConfigPlugin, install, setConfig };
