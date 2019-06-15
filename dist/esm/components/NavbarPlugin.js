import '../chunks/f3e511bd.js';
import '../chunks/efcf0387.js';
import 'vue';
import '../chunks/2cd43649.js';
import { i as installFactory } from '../chunks/2cc6687b.js';
import { B as BNavbarNav, a as BNavbar } from '../chunks/878f871d.js';
export { c as BNavbar, b as BNavbarNav } from '../chunks/878f871d.js';

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
