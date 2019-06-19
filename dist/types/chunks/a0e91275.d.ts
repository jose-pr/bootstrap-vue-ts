import { VueExtended, Directive, DirectiveBinding } from "a6dd0dc4";
export interface ScrollSpyConfig {
    element: string | HTMLElement | VueExtended;
    offset: number;
    method: string;
    throttle: number;
}
export declare class ScrollSpy extends Directive<ScrollSpyConfig> {
    $scroller?: HTMLElement | Window;
    $selector?: string;
    $offsets?: number[];
    $targets?: string[];
    $activeTarget?: string;
    $scrollHeight?: number;
    $resizeTimeout?: number;
    $obsScroller?: MutationObserver;
    $obsTargets?: MutationObserver;
    init(): void;
    static readonly Name: string;
    static readonly Default: ScrollSpyConfig;
    static readonly DefaultType: {
        element: string;
        offset: string;
        method: string;
        throttle: string;
    };
    static ParseBindings(bindings: DirectiveBinding): ScrollSpyConfig;
    listen(): void;
    _listen(): void;
    unlisten(): void;
    setObservers(on: boolean): void;
    handleEvent(evt: string | Event): void;
    refresh(): this | undefined;
    process(): void;
    getScroller(): HTMLElement | undefined | Window;
    getScrollTop(): number;
    getScrollHeight(): number;
    getOffsetHeight(): number;
    activate(target: string): void;
    clear(): void;
    setActiveState(el: unknown, active: boolean): void;
}
export declare const VBScrollspy: {
    bind(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    inserted(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    update(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    componentUpdated(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    unbind(el: HTMLElement): void;
};
export default VBScrollspy;
