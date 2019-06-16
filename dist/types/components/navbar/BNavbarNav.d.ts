import Vue from "vue";
import { BooleanLike } from "../../chunks/1b6c0039";
export interface BNavbarNavConfig {
    tag: string;
    type: string;
    variant: string;
    toggleable: BooleanLike;
    fixed: string;
    sticky: BooleanLike;
    print: BooleanLike;
}
export declare const BNavbarNav: import("vue").VueConstructor<BNavbarNavConfig & Vue>;
export default BNavbarNav;
