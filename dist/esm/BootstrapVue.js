import './chunk-1bdb7d0e.js';
import 'vue';
import './chunk-39591e18.js';
import { i as installFactory, p as pluginFactory, s as setConfig } from './chunk-3491bae3.js';
export { s as setConfig } from './chunk-3491bae3.js';
import './chunk-cc02fd47.js';
import { l as link } from './chunk-3030e0e6.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from './chunk-3030e0e6.js';
import { B as BNavbarNav, a as BNavbar } from './chunk-5ce49cc6.js';
export { c as BNavbar, b as BNavbarNav } from './chunk-5ce49cc6.js';
import { V as VBModal } from './chunk-9ba5f56e.js';
export { a as VBModal } from './chunk-9ba5f56e.js';

const LinkComponents = {
    BLink: link
};
//
// Plugin
//
const LinkPlugin = {
    install: installFactory({ components: LinkComponents })
};

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

const componentPlugins = {
    LinkPlugin,
    NavbarPlugin
};
const componentsPlugin = {
    install: installFactory({ plugins: componentPlugins })
};

const VBModalDirectives = {
    VBModal: VBModal
};
//
// Plugin
//
const VBModalPlugin = {
    install: installFactory({ components: VBModalDirectives })
};

const directivePlugins = {
    VBModalPlugin
};
const directivesPlugin = {
    install: installFactory({ plugins: directivePlugins })
};

//
const BVConfigPlugin = /* #__PURE__ */ pluginFactory();

// BootstrapVue installer
const install = installFactory({ plugins: { componentsPlugin, directivesPlugin } });
const BootstrapVue = {
    install: install,
    setConfig: setConfig
};

export default BootstrapVue;
export { BVConfigPlugin as BVConfig, BVConfigPlugin, BootstrapVue, LinkComponents, LinkPlugin, NavbarComponents, NavbarPlugin, VBModalDirectives, VBModalPlugin, componentPlugins, componentsPlugin, directivePlugins, directivesPlugin, install };
