import { BvPlugin, setConfig } from "chunk-2cc6687b";
import { BLinkConfig } from "LinkPlugin";
import { BNavbarNavConfig, BNavbarConfig } from "NavbarPlugin";
import { PluginFunction } from "chunk-f3e511bd";
import { BvComponentConfig } from "chunk-2cd43649";
declare const LinkPlugin: BvPlugin;
declare const NavbarPlugin: BvPlugin;
interface ComponentsConfig {
    BLink?: BLinkConfig;
    BNavbarNav?: BNavbarNavConfig;
    BNavbar?: BNavbarConfig;
}
declare const VBModalPlugin: BvPlugin;
declare const BVConfigPlugin: import("chunk-2cc6687b").BvPlugin;
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
export * from "chunk-9f07a9fc";
export * from "chunk-878f871d";
export * from "chunk-878f871d";
export * from "LinkPlugin";
export * from "NavbarPlugin";
export * from "chunk-8a0e383a";
export * from "VBModalPlugin";
export { BVConfigPlugin as BVConfig };
export { LinkPlugin, NavbarPlugin, VBModalPlugin, BVConfigPlugin, install, setConfig };
