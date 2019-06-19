import '../chunks/a6dd0dc4.js';
import 'vue';
import '../chunks/224339a2.js';
import { i as installFactory } from '../chunks/d4da053b.js';
import { B as BNavbarNav, a as BNavbar } from '../chunks/5aae1bf9.js';
export { c as BNavbar, b as BNavbarNav } from '../chunks/5aae1bf9.js';

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
