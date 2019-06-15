import { BvPlugin } from '../../core/BvPlugin';
import * as BNavbarNavComponent from './navbar-nav';
import * as BNavbarComponent from './navbar';
export declare const NavbarComponents: {
    BNavbarNav: import("vue").VueConstructor<BNavbarNavComponent.BNavbarNavConfig & import("vue").default>;
    BNavbar: import("vue").VueConstructor<BNavbarComponent.BNavbarConfig & import("vue").default>;
};
declare const NavbarPlugin: BvPlugin;
export default NavbarPlugin;
export { NavbarPlugin };
export * from './navbar-nav';
export * from './navbar';
