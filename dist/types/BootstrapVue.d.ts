import { BvPlugin, setConfig } from "chunk-3491bae3";
import { BLinkConfig } from "LinkPlugin";
import { BNavbarNavConfig, BNavbarConfig } from "NavbarPlugin";
import { PluginFunction } from "chunk-1bdb7d0e";
import { BvComponentConfig } from "chunk-39591e18";
declare const LinkPlugin: BvPlugin;
declare const NavbarPlugin: BvPlugin;
interface ComponentsConfig {
    BLink?: BLinkConfig;
    BNavbarNav?: BNavbarNavConfig;
    BNavbar?: BNavbarConfig;
}
declare const VBModalPlugin: BvPlugin;
declare const BVConfigPlugin: import("chunk-3491bae3").BvPlugin;
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
export * from "chunk-3030e0e6";
export * from "chunk-5ce49cc6";
export * from "chunk-5ce49cc6";
export * from "LinkPlugin";
export * from "NavbarPlugin";
export * from "chunk-9ba5f56e";
export * from "ModalDirectivePlugin";
export { BVConfigPlugin as BVConfig };
export { LinkPlugin, NavbarPlugin, VBModalPlugin, BVConfigPlugin, install, setConfig };
