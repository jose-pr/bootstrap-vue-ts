import { installFactory } from '../../core/BvPlugin';
//
//Import all components
//
import * as BLinkComponent from './link';
export const LinkComponents = {
    BLink: BLinkComponent.default,
};
//
//Plugin
//
const LinkPlugin = {
    install: installFactory({ components: LinkComponents })
};
//
//Exports
//
export default LinkPlugin;
export { LinkPlugin };
export * from './link';
