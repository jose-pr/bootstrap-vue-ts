import { installFactory } from '../core/BvPlugin'
import LinkPlugin, { BLinkConfig } from './link'
import NavbarPlugin, { BNavbarNavConfig, BNavbarConfig } from './navbar'
export interface ComponentsConfig {
  BLink?: BLinkConfig
  BNavbarNav?: BNavbarNavConfig
  BNavbar?: BNavbarConfig
}
export const componentPlugins = {
  LinkPlugin,
  NavbarPlugin
}
export const componentsPlugin = {
  install: installFactory({ plugins: componentPlugins })
}
export * from './link'
export * from './navbar'
