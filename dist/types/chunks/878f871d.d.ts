import Vue from "vue";
import { BooleanLike } from "efcf0387";
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
export interface BNavbarConfig {
    tag?: string | null;
    type?: string | null;
    variant?: string | null;
    toggleable?: BooleanLike;
    fixed?: string;
    sticky?: BooleanLike;
    print?: BooleanLike;
}
export declare const BNavbar: import("vue/types/vue").VueConstructor<BNavbarConfig & import("vue").default>;
export default BNavbar;
export { BNavbarNavConfig, BNavbarNav };
