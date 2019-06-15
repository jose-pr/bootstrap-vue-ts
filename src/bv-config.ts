
import Vue, { VueConstructor } from './utils/vue'
import { BvPlugin } from './common/BvPlugin'
import { setConfig, Config, DEFAULTS } from './utils/config'
import { BvComponent, BvComponentConfig } from './common/BvComponent';
import { Component } from 'vue-property-decorator'
import cloneDeep from './utils/clone-deep';
import get from './utils/get';
import { Dict, isObject, keys, isArray, isString, isUndefined, Primitive } from './utils';
import warn from './utils/warn';
import { ComponentsConfig } from './components';


// Plugin Config Options
export type BvConfigOptions = { breakpoints?:string[] } & ComponentsConfig & BvComponentConfig

@Component({})
export class BvConfig extends Vue implements BvComponent {
    $_config:BvConfigOptions = {}
    $_cachedBreakpoints:string[]|null = null  
  
    created(){
        this.$_config = {}
        this.$_cachedBreakpoints = null
    }

    getDefaults() {
        // Returns a copy of the defaults
        return cloneDeep(DEFAULTS)
      }
      getConfig() {
        // Returns a copy of the user config
        return cloneDeep(this.$_config)
      }
      resetConfig() {
        // Clear the config. For testing purposes only
        this.$_config = {}
      }
      getConfigValue(key:string) {
        // First we try the user config, and if key not found we fall back to default value
        // NOTE: If we deep clone DEFAULTS into config, then we can skip the fallback for get
        return cloneDeep(get(this.$_config, key, get(DEFAULTS, key)))
      }
      getComponentConfig(cmpName:string, key?:string) {
        // Return the particular config value for key for if specified,
        // otherwise we return the full config
        return key ? this.getConfigValue(`${cmpName}.${key}`) : this.getConfigValue(cmpName) || {}
      }
      getBreakpoints() {
        // Convenience method for getting all breakpoint names
        return this.getConfigValue('breakpoints') as string[]
      }
      getBreakpointsCached() {
        // Convenience method for getting all breakpoint names
        // Caches the results after first access
        if (!this.$_cachedBreakpoints) {
          this.$_cachedBreakpoints = this.getBreakpoints()
        }
        return cloneDeep(this.$_cachedBreakpoints)
      }
      getBreakpointsUp() {
        // Convenience method for getting breakpoints with
        // the smallest breakpoint set as ''
        // Useful for components that create breakpoint specific props
        const breakpoints = this.getBreakpoints()
        breakpoints[0] = ''
        return breakpoints
      }
      getBreakpointsUpCached() {
        // Convenience method for getting breakpoints with
        // the smallest breakpoint set as ''
        // Useful for components that create breakpoint specific props
        // Caches the results after first access
        const breakpoints = this.getBreakpointsCached()
        breakpoints[0] = ''
        return breakpoints
      }
      getBreakpointsDown() {
        // Convenience method for getting breakpoints with
        // the largest breakpoint set as ''
        // Useful for components that create breakpoint specific props
        const breakpoints = this.getBreakpoints()
        breakpoints[breakpoints.length - 1] = ''
        return breakpoints
      }
      getBreakpointsDownCached() /* istanbul ignore next: we don't use this method anywhere, yet */ {
        // Convenience method for getting breakpoints with
        // the largest breakpoint set as ''
        // Useful for components that create breakpoint specific props
        // Caches the results after first access
        const breakpoints = this.getBreakpointsCached()
        breakpoints[breakpoints.length - 1] = ''
        return breakpoints
      }
      setConfig(config:Dict<any> = {}) {
        if (!isObject(config)) {
          /* istanbul ignore next */
          return
        }
        keys(config)
          .filter(cmpName => config.hasOwnProperty(cmpName))
          .forEach(cmpName => {
            if (!DEFAULTS.hasOwnProperty(cmpName)) {
              /* istanbul ignore next */
              warn(`config: unknown config property "${cmpName}"`)
              /* istanbul ignore next */
              return
            }
            const cmpConfig = config[cmpName]
            if (cmpName === 'breakpoints') {
              // Special case for breakpoints
              const breakpoints = config.breakpoints
              if (
                !isArray(breakpoints) ||
                breakpoints.length < 2 ||
                breakpoints.some(b => !isString(b) || b.length === 0)
              ) {
                /* istanbul ignore next */
                warn('config: "breakpoints" must be an array of at least 2 breakpoint names')
              } else {
                this.$_config.breakpoints = cloneDeep(breakpoints)
              }
            } else if (isObject(cmpConfig)) {
              keys(cmpConfig)
                .filter(key => cmpConfig.hasOwnProperty(key))
                .forEach(key => {
                  if (!DEFAULTS[cmpName].hasOwnProperty(key)) {
                    /* istanbul ignore next */
                    warn(`config: unknown config property "${cmpName}.{$key}"`)
                  } else {
                    // If we pre-populate the config with defaults, we can skip this line
                    this.$_config[cmpName] = this.$_config[cmpName] || {}
                    if (!isUndefined(cmpConfig[key])) {
                      (this.$_config[cmpName] as Dict<Primitive>)[key] = cloneDeep(cmpConfig[key])
                    }
                  }
                })
            }
          })
      }
}


//
// Utility Plugin for setting the configuration
//
const BVConfigPlugin:BvPlugin = {
  install(Vue:VueConstructor, config = {}) {
    setConfig(config)
  }
}
export {
    BVConfigPlugin
}
export default BVConfigPlugin