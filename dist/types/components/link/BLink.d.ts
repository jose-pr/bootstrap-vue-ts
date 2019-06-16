import Vue from "Vue";
import { PropOptions } from "vue";
import { BvComponentConfig } from "../../chunks/8ccf66f8";
import { PropsDef, Dict } from "../../chunks/1b6c0039";
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
export interface BLinkConfig extends BvComponentConfig {
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
export declare const propsFactory: () => PropsDef<BLinkConfig>;
export declare const props: PropsDef<BLinkConfig>;
export declare const pickLinkProps: (propsToPick: string[]) => Dict<PropOptions<any>>;
export declare const omitLinkProps: (propsToOmit: string[]) => Dict<PropOptions<any>>;
declare const _default: import("vue").VueConstructor<BLinkConfig & Vue>;
export default _default;
