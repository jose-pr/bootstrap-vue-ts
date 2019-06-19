import { BvPlugin } from "d4da053b";
export declare const VBtooltipDirectives: {
    VBTooltip: {
        bind(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        inserted(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        update(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        componentUpdated(el: HTMLElement, bindings: import("vue/types/options").DirectiveBinding, vnode: import("vue").VNode): void;
        unbind(el: HTMLElement): void;
    };
};
declare const VBtooltipPlugin: BvPlugin;
export default VBtooltipPlugin;
export * from "6e3a15fa";
export { VBtooltipPlugin };
