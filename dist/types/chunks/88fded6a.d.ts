import { ToolTip, ToolTipConfig } from "cfdbb5bc";
import { DirectiveBinding } from "a6dd0dc4";
export declare type Triggers = 'focus' | 'hover' | 'click' | 'blur';
export declare class PopOver extends ToolTip {
    static readonly Default: ToolTipConfig;
    static readonly NAME: string;
    static ParseBindings<T = ToolTipConfig>(bindings: DirectiveBinding): T;
    isWithContent(tip: HTMLElement): boolean;
    addAttachmentClass(attachment: string): void;
    setContent(tip: HTMLElement): void;
    cleanTipClass(): void;
    getTitle(): string;
    getContent(): string;
}
export declare const VBPopover: {
    bind(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    inserted(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    update(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    componentUpdated(el: HTMLElement, bindings: DirectiveBinding, vnode: import("vue/types/vnode").VNode): void;
    unbind(el: HTMLElement): void;
};
export default VBPopover;
