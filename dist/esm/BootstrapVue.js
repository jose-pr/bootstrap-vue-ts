import './chunks/fbe932e6.js';
import 'vue';
import './chunks/04377600.js';
import { i as installFactory, s as setConfig } from './chunks/ca461e24.js';
export { s as setConfig } from './chunks/ca461e24.js';
import './chunks/cc02fd47.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from './chunks/ef49def3.js';
export { c as BNavbar, b as BNavbarNav } from './chunks/9a621529.js';
export { a as VBModal } from './chunks/e2797630.js';
export { a as VBPopover } from './chunks/cbc00e7e.js';
import { C as ComponentsPlugin, D as DirectivesPlugin } from './chunks/bb55e737.js';
export { B as BVConfig, B as BVConfigPlugin, a as ComponentPlugins, C as ComponentsPlugin, d as DirectivePlugins, D as DirectivesPlugin, L as LinkComponents, b as LinkPlugin, N as NavbarComponents, c as NavbarPlugin, V as VBmodalDirectives, e as VBmodalPlugin, f as VBpopoverDirectives, g as VBpopoverPlugin } from './chunks/bb55e737.js';

// BootstrapVue installer
const install = installFactory({ plugins: { ComponentsPlugin, DirectivesPlugin } });
const BootstrapVue = {
    install: install,
    setConfig: setConfig
};

export default BootstrapVue;
export { BootstrapVue, install };
