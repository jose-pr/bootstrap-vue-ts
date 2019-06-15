import { BLinkConfig } from './link';
import { BNavbarNavConfig, BNavbarConfig } from './navbar';
export interface ComponentsConfig {
    BLink?: BLinkConfig;
    BNavbarNav?: BNavbarNavConfig;
    BNavbar?: BNavbarConfig;
}
export declare const componentPlugins: {
    LinkPlugin: import("../core/BvPlugin").BvPlugin;
    NavbarPlugin: import("../core/BvPlugin").BvPlugin;
};
export declare const componentsPlugin: {
    install: import("vue").PluginFunction<BvConfigOptions>;
};
export * from './link';
export * from './navbar';
