import { installFactory, BvPlugin } from '../core/BvPlugin'
import LinkPlugin, { BLinkConfig } from './link'
import NavbarPlugin, { BNavbarNavConfig, BNavbarConfig } from './navbar'
export interface ComponentsConfig {
  BLink?: BLinkConfig
  BNavbarNav?: BNavbarNavConfig
  BNavbar?: BNavbarConfig
}
export const ComponentPlugins = {
  LinkPlugin,
  NavbarPlugin
}
export const ComponentsPlugin: BvPlugin = {
  install: installFactory({
    components: ComponentPlugins
  })
}
export * from './link'
export * from './navbar'
