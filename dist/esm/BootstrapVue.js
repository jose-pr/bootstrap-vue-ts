import './chunks/f3e511bd.js';
import './chunks/efcf0387.js';
import 'vue';
import './chunks/2cd43649.js';
import { i as installFactory, p as pluginFactory, s as setConfig } from './chunks/2cc6687b.js';
export { s as setConfig } from './chunks/2cc6687b.js';
import './chunks/cc02fd47.js';
import { l as link } from './chunks/9f07a9fc.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from './chunks/9f07a9fc.js';
import { B as BNavbarNav, a as BNavbar } from './chunks/878f871d.js';
export { c as BNavbar, b as BNavbarNav } from './chunks/878f871d.js';
import { V as VBModal } from './chunks/8a0e383a.js';
export { a as VBModal } from './chunks/8a0e383a.js';

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

// BootstrapVue installer
const install = installFactory({ plugins: { componentsPlugin, directivesPlugin } });
const BootstrapVue = {
    install: install,
    setConfig: setConfig
};

export default BootstrapVue;
export { BVConfigPlugin as BVConfig, BVConfigPlugin, BootstrapVue, LinkComponents, LinkPlugin, NavbarComponents, NavbarPlugin, VBModalDirectives, VBModalPlugin, componentPlugins, componentsPlugin, directivePlugins, directivesPlugin, install };
