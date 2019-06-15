import OurVue, { FunctionalComponentOptions, VueConstructor } from "vue";
import { PropOptions } from "vue/types/options";
import { RecordPropsDefinition } from "vue/types/options";
import { Dict } from './types';
export default OurVue;
export * from 'vue';
export * from 'vue/types/options';
export declare function functionalComponent<Props>(options: Omit<FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>, "functional"> & {
    methods?: Dict<Function>;
}): VueConstructor<Props & OurVue>;
/**
 * Checks if there are multiple instances of Vue, and warns (once) about possible issues.
 * @param {object} Vue
 */
export declare const checkMultipleVue: (Vue: VueConstructor<OurVue>) => void;
export declare type PropsDef<T> = {
    [k in keyof T]: PropOptions;
};
export interface VueElement extends HTMLElement {
    __vue__: OurVue;
}
export interface BvInstance {
    readonly $bvModal?: BvInstance;
    readonly $bvTotal?: BvInstance;
}
