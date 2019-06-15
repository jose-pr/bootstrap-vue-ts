import './chunk-1bdb7d0e.js';
import 'vue';
import './chunk-39591e18.js';
import { i as installFactory } from './chunk-3491bae3.js';
import { B as BNavbarNav, a as BNavbar } from './chunk-5ce49cc6.js';
export { c as BNavbar, b as BNavbarNav } from './chunk-5ce49cc6.js';

const NavbarComponents = {
    BNavbarNav: BNavbarNav,
    BNavbar: BNavbar
};
//
// Plugin
//
const NavbarPlugin = {
    install: installFactory({ components: NavbarComponents })
};

export default NavbarPlugin;
export { NavbarComponents, NavbarPlugin };
