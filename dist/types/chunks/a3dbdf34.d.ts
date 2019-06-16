import * as BLinkComponent from "fe59a6ba";
import * as BNavbarNavComponent from "19bc14e4";
import * as BNavbarComponent from "19bc14e4";
import { BvPlugin } from "a31a6b53";
import { BLinkConfig } from "../components/LinkPlugin";
import { BNavbarNavConfig, BNavbarConfig } from "../components/NavbarPlugin";
import { DirectiveOptions } from "a38114fa";
declare const LinkComponents: {
    BLink: import("vue").VueConstructor<BLinkComponent.BLinkConfig & import("vue").default>;
};
declare const LinkPlugin: BvPlugin;
declare const NavbarComponents: {
    BNavbarNav: import("vue").VueConstructor<BNavbarNavComponent.BNavbarNavConfig & import("vue").default>;
    BNavbar: import("vue").VueConstructor<BNavbarComponent.BNavbarConfig & import("vue").default>;
};
declare const NavbarPlugin: BvPlugin;
interface ComponentsConfig {
    BLink?: BLinkConfig;
    BNavbarNav?: BNavbarNavConfig;
    BNavbar?: BNavbarConfig;
}
declare const componentPlugins: {
    LinkPlugin: import("a31a6b53").BvPlugin;
    NavbarPlugin: import("a31a6b53").BvPlugin;
};
declare const componentsPlugin: {
    install: import("vue").PluginFunction<any>;
};
declare const VBModalDirectives: {
    VBModal: DirectiveOptions;
};
declare const VBModalPlugin: BvPlugin;
declare const directivePlugins: {
    VBModalPlugin: import("a31a6b53").BvPlugin;
};
declare const directivesPlugin: {
    install: import("vue").PluginFunction<any>;
};
declare const BVConfigPlugin: import("a31a6b53").BvPlugin;
export default BVConfigPlugin;
export * from "fe59a6ba";
export * from "19bc14e4";
export * from "19bc14e4";
export * from "../components/LinkPlugin";
export * from "../components/NavbarPlugin";
export * from "20b2115e";
export * from "../directives/VBModalPlugin";
export { LinkPlugin, LinkComponents, NavbarPlugin, NavbarComponents, ComponentsConfig, componentPlugins, componentsPlugin, VBModalPlugin, VBModalDirectives, directivePlugins, directivesPlugin };
