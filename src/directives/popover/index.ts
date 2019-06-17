import { BvPlugin, installFactory } from '../../core/BvPlugin'
//
//Import all plugin components
//
import * as VBPopoverDirective from './popover'

export const VBpopoverDirectives = {
  VBPopover: VBPopoverDirective.default
}
//
//Plugin
//
const VBpopoverPlugin: BvPlugin = {
  install: installFactory({
    components: VBpopoverDirectives
  })
}
//
//Exports
//
export default VBpopoverPlugin
export { VBpopoverPlugin }
export * from './popover'
