import { BvPlugin, installFactory } from '../../common/BvPlugin'
//
//Import all components
//
import * as BLinkComponent from './link'

export const LinkComponents = {
    BLink:BLinkComponent.default,
}
//
//Plugin
//
const LinkPlugin:BvPlugin = {
    install: installFactory({components:LinkComponents})
}
//
//Exports
//
export default LinkPlugin
export { LinkPlugin }
export * from './link'
