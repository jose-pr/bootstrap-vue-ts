import { BooleanLike } from "../../chunks/a6dd0dc4";
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
