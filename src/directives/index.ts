import { installFactory, BvPlugin } from '../core/BvPlugin'
import VBmodalPlugin from './modal'
import VBpopoverPlugin from './popover'
import VBscrollspyPlugin from './scrollspy'
export const DirectivePlugins = {
  VBmodalPlugin,
  VBpopoverPlugin,
  VBscrollspyPlugin
}
export const DirectivesPlugin: BvPlugin = {
  install: installFactory({
    components: DirectivePlugins
  })
}
export * from './modal'
export * from './popover'
export * from './scrollspy'
