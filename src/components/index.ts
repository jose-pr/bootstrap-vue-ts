import { installFactory, BvPlugin } from '../core/BvPlugin'
import LinkPlugin, { BLinkConfig } from './link'
import NavbarPlugin, { BNavbarNavConfig, BNavbarConfig } from './navbar'
import TablePlugin, { BTableLiteConfig } from './table'
export interface ComponentsConfig {
  BLink?: BLinkConfig
  BNavbarNav?: BNavbarNavConfig
  BNavbar?: BNavbarConfig
  BTableLite?: BTableLiteConfig
}
export const ComponentPlugins = {
  LinkPlugin,
  NavbarPlugin,
  TablePlugin
}
export const ComponentsPlugin: BvPlugin = {
  install: installFactory({
    components: ComponentPlugins
  })
}
export * from './link'
export * from './navbar'
export * from './table'
