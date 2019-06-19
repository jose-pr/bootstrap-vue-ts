import { VNode, DirectiveBinding } from "a6dd0dc4";
export interface ToggleElement extends HTMLElement {
    __BV_toggle__: (id: string, state: boolean) => void;
    __BV_toggle_STATE__: boolean;
    __BV_toggle_CONTROLS__: string;
    __BV_toggle_TARGETS__: unknown[];
}
export declare const VBToggle: {
    bind(el: ToggleElement, binding: DirectiveBinding, vnode: VNode): void;
    componentUpdated: (el: ToggleElement, binding: DirectiveBinding, vnode: VNode) => void;
    updated: (el: ToggleElement, binding: DirectiveBinding, vnode: VNode) => void;
    unbind(el: ToggleElement, binding: DirectiveBinding, vnode: VNode): void;
};
export default VBToggle;
