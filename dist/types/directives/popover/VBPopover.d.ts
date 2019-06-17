import PopOver from "../../chunks/fbe932e6";
import { DirectiveBinding, VNode, VueElement } from "../../chunks/fbe932e6";
declare const BV_POPOVER = "__BV_PopOver__";
export declare type Triggers = 'focus' | 'hover' | 'click' | 'blur';
export interface PopoverElement extends VueElement {
    [BV_POPOVER]?: PopOver;
}
export declare const VBPopover: {
    bind(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    inserted(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    update(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    componentUpdated(el: PopoverElement, bindings: DirectiveBinding, vnode: VNode): void;
    unbind(el: PopoverElement): void;
};
export default VBPopover;
