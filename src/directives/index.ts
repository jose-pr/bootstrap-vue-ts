import { installFactory, BvPlugin } from '../core/BvPlugin'
import LinkPlugin, { BLinkConfig } from './link'
import NavbarPlugin, { BNavbarNavConfig, BNavbarConfig } from './navbar'
import VBmodalPlugin, { VBModalConfig } from './modal'
export interface DirectivesConfig {
  BLink?: BLinkConfig
  BNavbarNav?: BNavbarNavConfig
  BNavbar?: BNavbarConfig
  VBModal?: VBModalConfig
}
export const DirectivePlugins = {
  LinkPlugin,
  NavbarPlugin,
  VBmodalPlugin
}
export const DirectivesPlugin: BvPlugin = {
  install: installFactory({
    components: DirectivePlugins
  })
}
export * from './link'
export * from './navbar'
export * from './modal'
