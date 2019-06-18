import { BvPlugin, installFactory } from '../../core/BvPlugin'
//
//Import all plugin components
//
import * as VBScrollspyDirective from './scrollspy'

export const VBscrollspyDirectives = {
  VBScrollspy: VBScrollspyDirective.default
}
//
//Plugin
//
const VBscrollspyPlugin: BvPlugin = {
  install: installFactory({
    components: VBscrollspyDirectives
  })
}
//
//Exports
//
export default VBscrollspyPlugin
export { VBscrollspyPlugin }
export * from './scrollspy'
