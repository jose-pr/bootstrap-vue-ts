import { BvPlugin, installFactory } from '../../core/BvPlugin'
//
//Import all plugin components
//
import * as VBToggleDirective from './toggle'

export const VBtoggleDirectives = {
  VBToggle: VBToggleDirective.default
}
//
//Plugin
//
const VBtogglePlugin: BvPlugin = {
  install: installFactory({
    components: VBtoggleDirectives
  })
}
//
//Exports
//
export default VBtogglePlugin
export { VBtogglePlugin }
export * from './toggle'
