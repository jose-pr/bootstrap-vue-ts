import { BvPlugin, installFactory } from '../../core/BvPlugin'
//
//Import all plugin components
//
import * as VBModalDirective from './modal'

export const VBmodalDirectives = {
  VBModal: VBModalDirective.default
}
//
//Plugin
//
const VBmodalPlugin: BvPlugin = {
  install: installFactory({
    components: VBmodalDirectives
  })
}
//
//Exports
//
export default VBmodalPlugin
export { VBmodalPlugin }
export * from './modal'
