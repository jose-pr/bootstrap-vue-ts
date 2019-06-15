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
    install: {
        (Vue: import("vue").VueConstructor<import("vue").default>, config?: {}): void;
        installed: boolean;
    };
};
export * from './link';
export * from './navbar';
