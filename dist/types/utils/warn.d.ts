/**
 * Log a warning message to the console with BootstrapVue formatting
 * @param {string} message
 */
export declare const warn: (message: string) => void;
/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */
export declare const warnNotClient: (source: string) => boolean;
/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */
export declare const warnNoPromiseSupport: (source: string) => boolean;
/**
 * Warn when no MutationObserver support is given
 * @param {string} source
 * @returns {boolean} warned
 */
export declare const warnNoMutationObserverSupport: (source: string) => boolean;
export default warn;
