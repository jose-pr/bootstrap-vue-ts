import * as BLinkComponent from "fca9d7f0";
import * as BNavbarNavComponent from "87e7097d";
import * as BNavbarComponent from "87e7097d";
import { BvPlugin } from "dafa5b20";
import { BLinkConfig } from "../components/LinkPlugin";
import { BNavbarNavConfig, BNavbarConfig } from "../components/NavbarPlugin";
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
declare const ComponentPlugins: {
    LinkPlugin: BvPlugin;
    NavbarPlugin: BvPlugin;
};
declare const ComponentsPlugin: BvPlugin;
declare const VBmodalDirectives: {
    VBModal: import("vue").DirectiveOptions;
};
declare const VBmodalPlugin: BvPlugin;
declare const VBpopoverDirectives: {
    VBPopover: {
        bind(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        inserted(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        update(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        componentUpdated(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        unbind(el: HTMLElement): void;
    };
};
declare const VBpopoverPlugin: BvPlugin;
declare const VBscrollspyDirectives: {
    VBScrollspy: {
        bind(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        inserted(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        update(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        componentUpdated(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        unbind(el: HTMLElement): void;
    };
};
declare const VBscrollspyPlugin: BvPlugin;
declare const DirectivePlugins: {
    VBmodalPlugin: BvPlugin;
    VBpopoverPlugin: BvPlugin;
    VBscrollspyPlugin: BvPlugin;
};
declare const DirectivesPlugin: BvPlugin;
declare const BVConfigPlugin: import("dafa5b20").BvPlugin;
export default BVConfigPlugin;
export * from "fca9d7f0";
export * from "87e7097d";
export * from "87e7097d";
export * from "../components/LinkPlugin";
export * from "../components/NavbarPlugin";
export * from "ef478248";
export * from "3e54c52b";
export * from "e6721ef6";
export * from "../directives/VBmodalPlugin";
export * from "../directives/VBpopoverPlugin";
export * from "../directives/VBscrollspyPlugin";
export { LinkPlugin, LinkComponents, NavbarPlugin, NavbarComponents, ComponentsConfig, ComponentPlugins, ComponentsPlugin, VBmodalPlugin, VBmodalDirectives, VBpopoverPlugin, VBpopoverDirectives, VBscrollspyPlugin, VBscrollspyDirectives, DirectivePlugins, DirectivesPlugin };
