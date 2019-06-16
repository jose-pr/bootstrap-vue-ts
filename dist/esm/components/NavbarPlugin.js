import '../chunks/a38114fa.js';
import '../chunks/1b6c0039.js';
import 'vue';
import '../chunks/8ccf66f8.js';
import { i as installFactory } from '../chunks/a31a6b53.js';
import { B as BNavbarNav, a as BNavbar } from '../chunks/19bc14e4.js';
export { c as BNavbar, b as BNavbarNav } from '../chunks/19bc14e4.js';

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
