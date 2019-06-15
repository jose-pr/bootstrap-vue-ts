import './chunk-f3e511bd.js';
import './chunk-efcf0387.js';
import 'vue';
import './chunk-2cd43649.js';
import { i as installFactory } from './chunk-2cc6687b.js';
import { B as BNavbarNav, a as BNavbar } from './chunk-878f871d.js';
export { c as BNavbar, b as BNavbarNav } from './chunk-878f871d.js';

const NavbarComponents = {
    BNavbarNav: BNavbarNav,
    BNavbar: BNavbar,
};
//
//Plugin
//
const NavbarPlugin = {
    install: installFactory({ components: NavbarComponents })
};

export default NavbarPlugin;
export { NavbarComponents, NavbarPlugin };
