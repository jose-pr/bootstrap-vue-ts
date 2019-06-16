import BVConfigPlugin from "chunks/a3dbdf34";
import BootstrapVue from "BootstrapVue";
import { BvPlugin, setConfig } from "chunks/a31a6b53";
import { ComponentsConfig } from "chunks/a3dbdf34";
import { PluginFunction } from "chunks/a38114fa";
import { BvComponentConfig } from "chunks/8ccf66f8";
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
export * from "chunks/a3dbdf34";
export * from "chunks/a3dbdf34";
export { BVConfigPlugin, install, setConfig };
