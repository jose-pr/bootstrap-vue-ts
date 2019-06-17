import OurVue from "vue";
import Vue from "vue";
import Popper from "popper.js";
import Vue from "Vue";
import { FunctionalComponentOptions, VueConstructor, PropOptions } from "vue";
import { PropOptions, RecordPropsDefinition } from "vue/types/options";
import { PopperOptions, Placement, Boundary, Behavior, Data } from "popper.js";
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
interface VueElement extends HTMLElement {
    __vue__: OurVue;
}
interface VueExtended extends OurVue {
    $route?: unknown;
}
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
declare const offset: (el: Element) => {
    top: number;
    left: number;
};
interface ToolTipConfig {
    animation: boolean;
    template: string;
    trigger: string;
    title: string;
    delay: number | {
        show: number;
        hide: number;
    };
    html: boolean;
    placement: Placement;
    offset: number;
    arrowPadding: number | string;
    container: boolean | string;
    fallbackPlacement: Behavior;
    callbacks: Dict<Function>;
    boundary: HTMLElement | Boundary;
    boundaryPadding: number;
    content: string;
}
declare class ToolTip {
    private ['constructor'];
    $isEnabled: boolean | null;
    $fadeTimeout?: number;
    $hoverTimeout?: number;
    $visibleInterval?: number;
    $hoverState: string | null;
    $activeTrigger: Dict<boolean>;
    $popper: Popper | null;
    $element: HTMLElement | null;
    $tip: null | HTMLElement;
    $id: string | null;
    $root: null | VueExtended;
    $routeWatcher: (() => void) | null;
    $forceHide: null | (() => void);
    $doHide: null | ((id: string) => void);
    $doShow: null | ((id: string) => void);
    $doDisable: null | ((id: string) => void);
    $doEnable: null | ((id: string) => void);
    _noop: null | (() => void);
    $config: ToolTipConfig | null;
    constructor(element: HTMLElement, config: Partial<ToolTipConfig>, $root: VueExtended);
    static readonly Default: ToolTipConfig;
    static readonly NAME: string;
    updateConfig(config: Partial<ToolTipConfig>): void;
    destroy(): void;
    enable(): void;
    disable(): void;
    toggle(event: BvEvent): void;
    show(): void;
    visibleCheck(on: boolean): void;
    setWhileOpenListeners(on: boolean): void;
    forceHide(): void;
    hide(callback?: null | (() => void), force?: boolean): void;
    emitEvent(evt: BvEvent): void;
    getContainer(): HTMLElement;
    addAriaDescribedby(): void;
    removeAriaDescribedby(): void;
    removePopper(): void;
    transitionOnce(tip: HTMLElement, complete: Function): void;
    getTransitionEndEvents(): string[];
    update(): void;
    isWithContent(tip: HTMLElement): boolean;
    addAttachmentClass(attachment: string): void;
    getTipElement(): HTMLElement;
    compileTemplate(html: unknown): HTMLElement | null;
    setContent(tip: HTMLElement): void;
    setElementContent(container: HTMLElement | null, content: HTMLElement | string): void;
    getTitle(): string;
    static getAttachment(placement: string): Placement;
    listen(): void;
    unListen(): void;
    handleEvent(e: BvEvent & Event): void;
    setRouteWatcher(on: boolean): void;
    setModalListener(on: boolean): void;
    setRootListener(on: boolean): void;
    doHide(id: string): void;
    doShow(id: string): void;
    doDisable(id: string): void;
    doEnable(id: string): void;
    setOnTouchStartListener(on: boolean): void;
    fixTitle(): void;
    enter(e: Event | null): void;
    leave(e: Event | null): void;
    getPopperConfig(placement: Placement, tip: HTMLElement | null): PopperOptions;
    getOffset(placement: Placement, tip: HTMLElement | null): number | string;
    getPlacement(): Placement;
    isWithActiveTrigger(): boolean;
    cleanTipClass(): void;
    handlePopperPlacementChange(data: Data): void;
    fixTransition(tip: HTMLElement): void;
}
declare class PopOver extends ToolTip {
    static readonly Default: ToolTipConfig;
    static readonly NAME: string;
    isWithContent(tip: HTMLElement): boolean;
    addAttachmentClass(attachment: string): void;
    setContent(tip: HTMLElement): void;
    cleanTipClass(): void;
    getTitle(): string;
    getContent(): string;
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
declare const BV_POPOVER = "__BV_PopOver__";
declare type Triggers = 'focus' | 'hover' | 'click' | 'blur';
interface PopoverElement extends VueElement {
    [BV_POPOVER]?: PopOver;
}
declare const VBPopover: {
    bind(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    inserted(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    update(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    componentUpdated(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    unbind(el: PopoverElement): void;
};
declare module VBPopoverDirective {
    declare const BV_POPOVER = "__BV_PopOver__";
    declare type Triggers =  |  | ;
    interface PopoverElement extends VueElement {
        [BV_POPOVER]?: PopOver;
    }
    declare const VBPopover: {
        bind(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
        inserted(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
        update(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
        componentUpdated(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
        unbind(el: PopoverElement): void;
    };
}
declare const VBpopoverPlugin: BvPlugin;
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
export { BvEvent, bindTargets, unbindTargets, getTargets, LinkPlugin, NavbarPlugin, VBmodalPlugin, VBpopoverPlugin, BVConfigPlugin, install, setConfig };
