import { isBrowser, hasPromiseSupport, hasMutationObserverSupport, getNoWarn } from './env'

/**
 * Log a warning message to the console with BootstrapVue formatting
 * @param {string} message
 */
export const warn = (message: string) => /* istanbul ignore next */ {
  if (!getNoWarn()) {
    console.warn(`[BootstrapVue warn]: ${message}`)
  }
}

/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */
export const warnNotClient = (source: string) => {
  /* istanbul ignore else */
  if (isBrowser) {
    return false
  } else {
    warn(`${source}: Can not be called during SSR.`)
    return true
  }
}

/**
 * Warn when no Promise support is given
 * @param {string} source
 * @returns {boolean} warned
 */
export const warnNoPromiseSupport = (source: string) => {
  /* istanbul ignore else */
  if (hasPromiseSupport) {
    return false
  } else {
    warn(`${source}: Requires Promise support.`)
    return true
  }
}

/**
 * Warn when no MutationObserver support is given
 * @param {string} source
 * @returns {boolean} warned
 */
export const warnNoMutationObserverSupport = (source: string) => {
  /* istanbul ignore else */
  if (hasMutationObserverSupport) {
    return false
  } else {
    warn(`${source}: Requires MutationObserver support.`)
    return true
  }
}

// Default export
export default warn
