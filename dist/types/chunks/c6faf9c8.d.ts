import * as BLinkComponent from "803b0cbb";
import * as BNavbarNavComponent from "5aae1bf9";
import * as BNavbarComponent from "5aae1bf9";
import * as VBToggleDirective from "ecb7ab0c";
import { BvPlugin } from "d4da053b";
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
declare const VBtoggleDirectives: {
    VBToggle: {
        bind(el: VBToggleDirective.ToggleElement, binding: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        componentUpdated: (el: VBToggleDirective.ToggleElement, binding: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode) => void;
        updated: (el: VBToggleDirective.ToggleElement, binding: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode) => void;
        unbind(el: VBToggleDirective.ToggleElement, binding: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
    };
};
declare const VBtogglePlugin: BvPlugin;
declare const DirectivePlugins: {
    VBmodalPlugin: BvPlugin;
    VBpopoverPlugin: BvPlugin;
    VBscrollspyPlugin: BvPlugin;
    VBtogglePlugin: BvPlugin;
    VBtooltipPlugin: BvPlugin;
};
declare const DirectivesPlugin: BvPlugin;
declare const BVConfigPlugin: import("d4da053b").BvPlugin;
export default BVConfigPlugin;
export * from "803b0cbb";
export * from "5aae1bf9";
export * from "5aae1bf9";
export * from "../components/LinkPlugin";
export * from "../components/NavbarPlugin";
export * from "edb80088";
export * from "88fded6a";
export * from "a0e91275";
export * from "ecb7ab0c";
export * from "../directives/VBmodalPlugin";
export * from "../directives/VBpopoverPlugin";
export * from "../directives/VBscrollspyPlugin";
export * from "../directives/VBtogglePlugin";
export * from "cfdbb5bc";
export { LinkPlugin, LinkComponents, NavbarPlugin, NavbarComponents, ComponentsConfig, ComponentPlugins, ComponentsPlugin, VBmodalPlugin, VBmodalDirectives, VBpopoverPlugin, VBpopoverDirectives, VBscrollspyPlugin, VBscrollspyDirectives, VBtogglePlugin, VBtoggleDirectives, DirectivePlugins, DirectivesPlugin };
