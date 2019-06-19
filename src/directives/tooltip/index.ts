import { BvPlugin, installFactory } from '../../core/BvPlugin'
//
//Import all plugin components
//
import * as VBTooltipDirective from './tooltip'

export const VBtooltipDirectives = {
  VBTooltip: VBTooltipDirective.default
}
//
//Plugin
//
const VBtooltipPlugin: BvPlugin = {
  install: installFactory({
    components: VBtooltipDirectives
  })
}
//
//Exports
//
export default VBtooltipPlugin
export { VBtooltipPlugin }
export * from './tooltip'
