import { installFactory } from '../../core/BvPlugin';
//
// Import all components
//
import * as BNavbarNavComponent from './navbar-nav';
import * as BNavbarComponent from './navbar';
export const NavbarComponents = {
    BNavbarNav: BNavbarNavComponent.default,
    BNavbar: BNavbarComponent.default
};
//
// Plugin
//
const NavbarPlugin = {
    install: installFactory({ components: NavbarComponents })
};
//
// Exports
//
export default NavbarPlugin;
export { NavbarPlugin };
export * from './navbar-nav';
export * from './navbar';
