import Vue from "vue";
import { BooleanLike } from "../../chunks/efcf0387";
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