import '../chunks/5cd47ea1.js';
import 'vue';
import '../chunks/87e3debe.js';
import { i as installFactory } from '../chunks/dafa5b20.js';
import { B as BNavbarNav, a as BNavbar } from '../chunks/87e7097d.js';
export { c as BNavbar, b as BNavbarNav } from '../chunks/87e7097d.js';

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
