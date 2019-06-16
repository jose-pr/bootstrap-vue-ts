import './a38114fa.js';
import { i as installFactory, p as pluginFactory } from './a31a6b53.js';
import { l as link } from './fe59a6ba.js';
import { B as BNavbarNav, a as BNavbar } from './19bc14e4.js';
import { V as VBModal } from './20b2115e.js';

const LinkComponents = {
    BLink: link,
};
//
//Plugin
//
const LinkPlugin = {
    install: installFactory({ components: LinkComponents })
};

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

const componentPlugins = {
    LinkPlugin,
    NavbarPlugin,
};
const componentsPlugin = {
    install: installFactory({ plugins: componentPlugins })
};

const VBModalDirectives = {
    VBModal: VBModal,
};
//
//Plugin
//
const VBModalPlugin = {
    install: installFactory({ components: VBModalDirectives })
};

const directivePlugins = {
    VBModalPlugin,
};
const directivesPlugin = {
    install: installFactory({ plugins: directivePlugins })
};

//
const BVConfigPlugin = /* #__PURE__ */ pluginFactory();

export { BVConfigPlugin as B, LinkComponents as L, NavbarComponents as N, VBModalDirectives as V, componentPlugins as a, LinkPlugin as b, componentsPlugin as c, directivesPlugin as d, NavbarPlugin as e, directivePlugins as f, VBModalPlugin as g };
