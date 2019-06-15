import OurVue from "vue";
import { warn } from './warn';
import { isJSDOM } from './env';
//
// Single point of contact for Vue
//
// TODO:
//   Conditionally import Vue if no global Vue
//
const Vue = OurVue;
export default OurVue;
export * from 'vue';
export function functionalComponent(options) {
    return Vue.extend(Object.assign({}, options, { functional: true }));
}
/**
 * Checks if there are multiple instances of Vue, and warns (once) about possible issues.
 * @param {object} Vue
 */
export const checkMultipleVue = (() => {
    let checkMultipleVueWarned = false;
    const MULTIPLE_VUE_WARNING = [
        'Multiple instances of Vue detected!',
        'You may need to set up an alias for Vue in your bundler config.',
        'See: https://bootstrap-vue.js.org/docs#using-module-bundlers'
    ].join('\n');
    return (Vue) => {
        /* istanbul ignore next */
        if (!checkMultipleVueWarned && OurVue !== Vue && !isJSDOM) {
            warn(MULTIPLE_VUE_WARNING);
        }
        checkMultipleVueWarned = true;
    };
})();
