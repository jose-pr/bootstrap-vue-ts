import { BvPlugin, installFactory } from '../../common/BvPlugin'
import { DirectiveOptions, DirectiveFunction } from '../../utils/vue'
import { Dict } from '../../utils/types'
//
//Import all directives
//
import * as VBModalDirective from './modal'

export const VBModalDirectives = {
    VBModal:VBModalDirective.default,
}
//
//Plugin
//
const VBModalPlugin:BvPlugin = {
    install: installFactory({components:VBModalDirectives})
}
//
//Exports
//
export default VBModalPlugin
export { VBModalPlugin }
export * from './modal'
