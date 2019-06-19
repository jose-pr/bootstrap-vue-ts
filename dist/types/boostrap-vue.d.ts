import OurVue from "vue";
import Vue from "vue";
import Vue from "Vue";
import { FunctionalComponentOptions, VueConstructor, PropOptions } from "vue";
import { PropOptions, RecordPropsDefinition } from "vue/types/options";
declare type Primitive = string | boolean | number;
declare type BooleanLike = string | boolean | number;
interface Dict<T> {
    [key: string]: T;
}
interface BvEventInit {
    type: string;
    cancelable: boolean;
    nativeEvent: boolean;
    target: Element | null;
    relatedTarget: Element | null;
    vueTarget: any;
    componentId: string;
}
declare class BvEvent<T = never> implements Partial<Event> {
    type: string;
    cancelable: boolean;
    nativeEvent: boolean;
    target: Element | null;
    relatedTarget: Element | null;
    vueTarget: any;
    componentId: string;
    readonly defaultPrevented: boolean;
    readonly preventDefault: () => void;
    constructor(type: string, eventInit?: Partial<BvEventInit & T>);
    static readonly Defaults: {
        type: string;
        cancelable: boolean;
        nativeEvent: null;
        target: null;
        relatedTarget: null;
        vueTarget: null;
        componentId: null;
    };
}
declare type PropsDef<T> = {
    [k in keyof T]: PropOptions;
};
declare global {
    interface Window {
        webkitRequestAnimationFrame(cb: FrameRequestCallback): number;
        mozRequestAnimationFrame(cb: FrameRequestCallback): number;
        msRequestAnimationFrame(cb: FrameRequestCallback): number;
        oRequestAnimationFrame(cb: FrameRequestCallback): number;
        MutationObserver: MutationObs;
        WebKitMutationObserver: MutationObs;
        MozMutationObserver: MutationObs;
    }
}
declare const MutationObs: MutationObs;
interface MutationObs {
    new (callback: MutationCallback): MutationObserver;
}
declare const getTargets: (binding: DirectiveBinding) => string[];
declare const bindTargets: (vnode: VNode, binding: DirectiveBinding, listenTypes: Dict<boolean>, fn: (target: {
    targets: string[];
    vnode: VNode;
}) => void) => string[];
declare const unbindTargets: (vnode: VNode, binding: DirectiveBinding, listenTypes: Dict<boolean>) => void;
declare type BvComponentConfig = Dict<Primitive | Dict<Primitive | null | undefined> | Primitive[] | null | undefined>;
declare const setConfig: (config?: {}, Vue?: import("vue/types/vue").VueConstructor<OurVue>) => void;
interface BvPlugin extends PluginObject<BvConfigOptions> {
    install: PluginFunction<BvConfigOptions>;
}
/**
 * The Link component is used in many other BV components.
 * As such, sharing its props makes supporting all its features easier.
 * However, some components need to modify the defaults for their own purpose.
 * Prefer sharing a fresh copy of the props to ensure mutations
 * do not affect other component references to the props.
 *
 * https://github.com/vuejs/vue-router/blob/dev/src/components/link.js
 * @return {{}}
 */
interface BLinkConfig extends BvComponentConfig {
    href?: string;
    rel?: string;
    target?: string;
    active?: boolean;
    disabled?: boolean;
    to?: string | {
        path?: string;
        query?: string;
        hash?: string;
    };
    append?: boolean;
    replace?: boolean;
    event?: string | [];
    activeClass?: string;
    exact?: boolean;
    exactActiveClass?: boolean;
    routerTag?: string;
    noPrefetch?: boolean;
}
declare const propsFactory: () => PropsDef<BLinkConfig>;
declare const props: PropsDef<BLinkConfig>;
declare const pickLinkProps: (propsToPick: string[]) => Dict<PropOptions<any>>;
declare const omitLinkProps: (propsToOmit: string[]) => Dict<PropOptions<any>>;
declare const _default_$0: import("vue").VueConstructor<BLinkConfig & Vue>;
declare module BLinkComponent {
    interface BLinkConfig extends BvComponentConfig {
        href?: string;
        rel?: string;
        target?: string;
        active?: boolean;
        disabled?: boolean;
        to?: string | {
            path?: string;
            query?: string;
            hash?: string;
        };
        append?: boolean;
        replace?: boolean;
        event?: string | [];
        activeClass?: string;
        exact?: boolean;
        exactActiveClass?: boolean;
        routerTag?: string;
        noPrefetch?: boolean;
    }
    declare const propsFactory: () => PropsDef<BLinkConfig>;
    declare const props: PropsDef<BLinkConfig>;
    declare const pickLinkProps: (propsToPick: string[]) => Dict<PropOptions<any>>;
    declare const omitLinkProps: (propsToOmit: string[]) => Dict<PropOptions<any>>;
    declare const _default_$0: import("vue").VueConstructor<BLinkConfig & Vue>;
}
declare const LinkPlugin: BvPlugin;
interface BNavbarNavConfig {
    tag: string;
    type: string;
    variant: string;
    toggleable: BooleanLike;
    fixed: string;
    sticky: BooleanLike;
    print: BooleanLike;
}
declare const BNavbarNav: import("vue").VueConstructor<BNavbarNavConfig & Vue>;
interface BNavbarConfig {
    tag?: string | null;
    type?: string | null;
    variant?: string | null;
    toggleable?: BooleanLike;
    fixed?: string;
    sticky?: BooleanLike;
    print?: BooleanLike;
}
declare const BNavbar: import("vue/types/vue").VueConstructor<BNavbarConfig & import("vue").default>;
declare module BNavbarNavComponent {
    interface BNavbarNavConfig {
        tag: string;
        type: string;
        variant: string;
        toggleable: BooleanLike;
        fixed: string;
        sticky: BooleanLike;
        print: BooleanLike;
    }
    declare const BNavbarNav: import("vue").VueConstructor<BNavbarNavConfig & Vue>;
}
declare module BNavbarComponent {
    interface BNavbarConfig {
        tag?: string | null;
        type?: string | null;
        variant?: string | null;
        toggleable?: BooleanLike;
        fixed?: string;
        sticky?: BooleanLike;
        print?: BooleanLike;
    }
    declare const BNavbar: import("vue/types/vue").VueConstructor<BNavbarConfig & import("vue").default>;
}
declare const NavbarPlugin: BvPlugin;
interface ComponentsConfig {
    BLink?: BLinkConfig;
    BNavbarNav?: BNavbarNavConfig;
    BNavbar?: BNavbarConfig;
}
declare const VBmodalPlugin: BvPlugin;
declare const VBtooltipPlugin: BvPlugin;
declare const VBpopoverPlugin: BvPlugin;
declare const VBscrollspyPlugin: BvPlugin;
interface ToggleElement extends HTMLElement {
    __BV_toggle__: (id: string, state: boolean) => void;
    __BV_toggle_STATE__: boolean;
    __BV_toggle_CONTROLS__: string;
    __BV_toggle_TARGETS__: unknown[];
}
declare const VBToggle: {
    bind(el: ToggleElement, binding: DirectiveBinding, vnode: VNode): void;
    componentUpdated: (el: ToggleElement, binding: DirectiveBinding, vnode: VNode) => void;
    updated: (el: ToggleElement, binding: DirectiveBinding, vnode: VNode) => void;
    unbind(el: ToggleElement, binding: DirectiveBinding, vnode: VNode): void;
};
declare module VBToggleDirective {
    interface ToggleElement extends HTMLElement {
        __BV_toggle__: (id: string, state: boolean) => void;
        __BV_toggle_STATE__: boolean;
        __BV_toggle_CONTROLS__: string;
        __BV_toggle_TARGETS__: unknown[];
    }
    declare const VBToggle: {
        bind(el: ToggleElement, binding: DirectiveBinding, vnode: VNode): void;
        componentUpdated: (el: ToggleElement, binding: DirectiveBinding, vnode: VNode) => void;
        updated: (el: ToggleElement, binding: DirectiveBinding, vnode: VNode) => void;
        unbind(el: ToggleElement, binding: DirectiveBinding, vnode: VNode): void;
    };
}
declare const VBtogglePlugin: BvPlugin;
declare const BVConfigPlugin: BvPlugin;
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
export * from 'vue';
export * from 'vue/types/options';
export { BVConfigPlugin as BVConfig };
export { BvEvent, bindTargets, unbindTargets, getTargets, LinkPlugin, NavbarPlugin, VBmodalPlugin, VBtooltipPlugin, VBpopoverPlugin, VBscrollspyPlugin, VBtogglePlugin, BVConfigPlugin, install, setConfig };
