import '../chunks/fbe932e6.js';
import 'vue';
import '../chunks/04377600.js';
import { i as installFactory } from '../chunks/ca461e24.js';
import { B as BNavbarNav, a as BNavbar } from '../chunks/9a621529.js';
export { c as BNavbar, b as BNavbarNav } from '../chunks/9a621529.js';

const NavbarComponents = {
    BNavbarNav: BNavbarNav,
    BNavbar: BNavbar
};
//
//Plugin
//
const NavbarPlugin = {
    install: installFactory({
        components: NavbarComponents
    })
};

export default NavbarPlugin;
export { NavbarComponents, NavbarPlugin };
