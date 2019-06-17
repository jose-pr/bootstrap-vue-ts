import * as BLinkComponent from "ef49def3";
import * as BNavbarNavComponent from "9a621529";
import * as BNavbarComponent from "9a621529";
import * as VBPopoverDirective from "cbc00e7e";
import { BvPlugin } from "ca461e24";
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
        bind(el: VBPopoverDirective.PopoverElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        inserted(el: VBPopoverDirective.PopoverElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        update(el: VBPopoverDirective.PopoverElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        componentUpdated(el: VBPopoverDirective.PopoverElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        unbind(el: VBPopoverDirective.PopoverElement): void;
    };
};
declare const VBpopoverPlugin: BvPlugin;
declare const DirectivePlugins: {
    VBmodalPlugin: BvPlugin;
    VBpopoverPlugin: BvPlugin;
};
declare const DirectivesPlugin: BvPlugin;
declare const BVConfigPlugin: import("ca461e24").BvPlugin;
export default BVConfigPlugin;
export * from "ef49def3";
export * from "9a621529";
export * from "9a621529";
export * from "../components/LinkPlugin";
export * from "../components/NavbarPlugin";
export * from "e2797630";
export * from "cbc00e7e";
export * from "../directives/VBmodalPlugin";
export * from "../directives/VBpopoverPlugin";
export { LinkPlugin, LinkComponents, NavbarPlugin, NavbarComponents, ComponentsConfig, ComponentPlugins, ComponentsPlugin, VBmodalPlugin, VBmodalDirectives, VBpopoverPlugin, VBpopoverDirectives, DirectivePlugins, DirectivesPlugin };
