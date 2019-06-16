import './chunks/a38114fa.js';
import './chunks/1b6c0039.js';
import 'vue';
import './chunks/8ccf66f8.js';
import { i as installFactory, s as setConfig } from './chunks/a31a6b53.js';
export { s as setConfig } from './chunks/a31a6b53.js';
import './chunks/cc02fd47.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from './chunks/fe59a6ba.js';
export { c as BNavbar, b as BNavbarNav } from './chunks/19bc14e4.js';
export { a as VBModal } from './chunks/20b2115e.js';
import { c as componentsPlugin, d as directivesPlugin } from './chunks/a3dbdf34.js';
export { B as BVConfig, B as BVConfigPlugin, L as LinkComponents, b as LinkPlugin, N as NavbarComponents, e as NavbarPlugin, V as VBModalDirectives, g as VBModalPlugin, a as componentPlugins, c as componentsPlugin, f as directivePlugins, d as directivesPlugin } from './chunks/a3dbdf34.js';

// BootstrapVue installer
const install = installFactory({ plugins: { componentsPlugin, directivesPlugin } });
const BootstrapVue = {
    install: install,
    setConfig: setConfig
};

export default BootstrapVue;
export { BootstrapVue, install };
