import { installFactory, BvPlugin } from '../core/BvPlugin'
import VBmodalPlugin from './modal'
import VBpopoverPlugin from './popover'
import VBscrollspyPlugin from './scrollspy'
import VBtogglePlugin from './toggle'
import VBtooltipPlugin from './tooltip'
export const DirectivePlugins = {
  VBmodalPlugin,
  VBpopoverPlugin,
  VBscrollspyPlugin,
  VBtogglePlugin,
  VBtooltipPlugin
}
export const DirectivesPlugin: BvPlugin = {
  install: installFactory({
    components: DirectivePlugins
  })
}
export * from './modal'
export * from './popover'
export * from './scrollspy'
export * from './toggle'
export * from './tooltip'
