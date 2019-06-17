import { installFactory, BvPlugin } from '../core/BvPlugin'
import VBmodalPlugin from './modal'
import VBpopoverPlugin from './popover'
export const DirectivePlugins = {
  VBmodalPlugin,
  VBpopoverPlugin
}
export const DirectivesPlugin: BvPlugin = {
  install: installFactory({
    components: DirectivePlugins
  })
}
export * from './modal'
export * from './popover'
