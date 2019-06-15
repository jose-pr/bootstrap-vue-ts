import { BvPlugin, setConfig } from "chunks/2cc6687b";
import { BLinkConfig } from "components/LinkPlugin";
import { BNavbarNavConfig, BNavbarConfig } from "components/NavbarPlugin";
import { PluginFunction } from "chunks/f3e511bd";
import { BvComponentConfig } from "chunks/2cd43649";
declare const LinkPlugin: BvPlugin;
declare const NavbarPlugin: BvPlugin;
interface ComponentsConfig {
    BLink?: BLinkConfig;
    BNavbarNav?: BNavbarNavConfig;
    BNavbar?: BNavbarConfig;
}
declare const VBModalPlugin: BvPlugin;
declare const BVConfigPlugin: import("chunks/2cc6687b").BvPlugin;
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
export * from "chunks/9f07a9fc";
export * from "chunks/878f871d";
export * from "chunks/878f871d";
export * from "components/LinkPlugin";
export * from "components/NavbarPlugin";
export * from "chunks/8a0e383a";
export * from "directives/VBModalPlugin";
export { BVConfigPlugin as BVConfig };
export { LinkPlugin, NavbarPlugin, VBModalPlugin, BVConfigPlugin, install, setConfig };
