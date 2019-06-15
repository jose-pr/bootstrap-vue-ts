import Vue from './vue'
import cloneDeep from './clone-deep'
import get from './get'
import warn from './warn'
import { isArray, isObject, isString, isUndefined } from './inspect'
import { keys } from './object'
import {Component} from 'vue-property-decorator'
import { BvComponent } from '@/common/BvComponent';
import { Primitive, Dict } from './types';
import { BvConfig, BvConfigOptions } from '../bv-config';

// General BootstrapVue configuration
//
// BREAKPOINT DEFINITIONS
//
// Some components (BCol and BFormGroup) generate props based on breakpoints, and this
// occurs when the component is first loaded (evaluated), which may happen before the
// config is created/modified
//
// To get around this we make these components async (lazy evaluation)
// The component definition is only called/executed when the first access to the
// component is used (and cached on subsequent uses)
//
// See: https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components
//
// PROP DEFAULTS
//
// For default values on props, we use the default value factory function approach so
// so that the default values are pulled in at each component instantiation
//
//  props: {
//    variant: {
//      type: String,
//      default: () => getConfigComponent('BAlert', 'variant')
//    }
//  }



export type Config = Dict<Dict<Primitive|null>|string[]> 

// prettier-ignore
export const DEFAULTS:Config = {
  // Breakpoints
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],

  // Component Specific defaults are keyed by the component
  // name (PascalCase) and prop name (camelCase)
  BAlert: {
    dismissLabel: 'Close',
    variant: 'info'
  },
  BBadge: {
    variant: 'secondary'
  },
  BButton: {
    variant: 'secondary'
  },
  BButtonClose: {
    // `textVariant` is `null` to inherit the current text color
    textVariant: null,
    ariaLabel: 'Close'
  },
  BCardSubTitle: {
    // BCard and BCardBody also inherit this prop
    subTitleTextVariant: 'muted'
  },
  BCarousel: {
    labelPrev: 'Previous Slide',
    labelNext: 'Next Slide',
    labelGotoSlide: 'Goto Slide',
    labelIndicators: 'Select a slide to display'
  },
  BDropdown: {
    toggleText: 'Toggle Dropdown',
    variant: 'secondary',
    splitVariant: null
  },
  BFormFile: {
    browseText: 'Browse',
    // Chrome default file prompt
    placeholder: 'No file chosen',
    dropPlaceholder: 'Drop files here'
  },
  BFormText: {
    textVariant: 'muted'
  },
  BImg: {
    blankColor: 'transparent'
  },
  BImgLazy: {
    blankColor: 'transparent'
  },
  BJumbotron: {
    bgVariant: null,
    borderVariant: null,
    textVariant: null
  },
  BListGroupItem: {
    variant: null
  },
  BModal: {
    titleTag: 'h5',
    size: 'md',
    headerBgVariant: null,
    headerBorderVariant: null,
    headerTextVariant: null,
    headerCloseVariant: null,
    bodyBgVariant: null,
    bodyTextVariant: null,
    footerBgVariant: null,
    footerBorderVariant: null,
    footerTextVariant: null,
    cancelTitle: 'Cancel',
    cancelVariant: 'secondary',
    okTitle: 'OK',
    okVariant: 'primary',
    headerCloseLabel: 'Close'
  },
  BNavbar: {
    variant: null
  },
  BNavbarToggle: {
    label: 'Toggle navigation'
  },
  BProgress: {
    variant: null
  },
  BProgressBar: {
    variant: null
  },
  BSpinner: {
    variant: null
  },
  BTable: {
    selectedVariant: 'primary',
    headVariant: null,
    footVariant: null
  },
  BToast: {
    toaster: 'b-toaster-top-right',
    autoHideDelay: 5000,
    variant: null,
    toastClass: null,
    headerClass: null,
    bodyClass: null,
    solid: false
  },
  BToaster: {
    ariaLive: null,
    ariaAtomic: null,
    role: null
  },
  BTooltip: {
    delay: 0,
    boundary: 'scrollParent',
    boundaryPadding: 5
  },
  BPopover: {
    delay: 0,
    boundary: 'scrollParent',
    boundaryPadding: 5
  }
}


// This contains user defined configuration manager object.
// This object should be treated as private!
Vue.prototype.$bvConfig = Vue.prototype.$bvConfig || new BvConfig()

// Method to get a deep clone (immutable) copy of the defaults
const getDefaults = () => {
  return Vue.prototype.$bvConfig.getDefaults()
}

// Method to set the config
// Merges in only known top-level and sub-level keys
//   Vue.use(BootstrapVue, config)
// or
//   BootstrapVue.setConfig(config)
//   Vue.use(BootstrapVue)
const setConfig = (config:BvConfigOptions = {}) => {
  Vue.prototype.$bvConfig.setConfig(config)
}

// Reset the user config to default
// For testing purposes only
const resetConfig = () => {
  Vue.prototype.$bvConfig.resetConfig()
}

// Get the current user config
// For testing purposes only
const getConfig = () => {
  return Vue.prototype.$bvConfig.getConfig()
}

// Method to grab a config value based on a dotted/array notation key
// Returns a deep clone (immutable) copy
const getConfigValue = (key:string) => {
  return Vue.prototype.$bvConfig.getConfigValue(key)
}

// Method to grab a config value for a particular component.
// Returns a deep clone (immutable) copy
const getComponentConfig = (cmpName:string, key = null) => {
  // Return the particular config value for key for if specified,
  // otherwise we return the full config
  return Vue.prototype.$bvConfig.getComponentConfig(cmpName, key)
}

// Convenience method for getting all breakpoint names
const getBreakpoints = () => {
  return Vue.prototype.$bvConfig.getBreakpoints()
}

// Convenience method for getting all breakpoint names
// Caches the results after first access
/* istanbul ignore next: we don't use this method directly in any components, yet */
const getBreakpointsCached = () => {
  return Vue.prototype.$bvConfig.getBreakpointsCached()
}

// Convenience method for getting breakpoints with
// the smallest breakpoint set as ''
// Useful for components that create breakpoint specific props
const getBreakpointsUp = () => {
  return Vue.prototype.$bvConfig.getBreakpointsUp()
}

// Convenience method for getting breakpoints with
// the smallest breakpoint set as ''
// Useful for components that create breakpoint specific props
// Caches the results after first access
const getBreakpointsUpCached = () => {
  return Vue.prototype.$bvConfig.getBreakpointsUpCached()
}

// Convenience method for getting breakpoints with
// the largest breakpoint set as ''
// Useful for components that create breakpoint specific props
const getBreakpointsDown = () => {
  return Vue.prototype.$bvConfig.getBreakpointsDown()
}

// Convenience method for getting breakpoints with
// the largest breakpoint set as ''
// Useful for components that create breakpoint specific props
// Caches the results after first access
/* istanbul ignore next: we don't use this method anywhere, yet */
const getBreakpointsDownCached = () => {
  return Vue.prototype.$bvConfig.getBreakpointsDownCached()
}

// Named Exports
export {
  setConfig,
  resetConfig,
  getConfig,
  getDefaults,
  getConfigValue,
  getComponentConfig,
  getBreakpoints,
  getBreakpointsUp,
  getBreakpointsDown,
  getBreakpointsCached,
  getBreakpointsUpCached,
  getBreakpointsDownCached
}
