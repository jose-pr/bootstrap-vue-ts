import './chunks/5cd47ea1.js';
import 'vue';
import './chunks/87e3debe.js';
import { i as installFactory, s as setConfig } from './chunks/dafa5b20.js';
export { s as setConfig } from './chunks/dafa5b20.js';
import './chunks/cc02fd47.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from './chunks/fca9d7f0.js';
export { c as BNavbar, b as BNavbarNav } from './chunks/87e7097d.js';
export { a as VBModal } from './chunks/ef478248.js';
export { P as PopOver, a as VBPopover } from './chunks/3e54c52b.js';
export { S as ScrollSpy, a as VBScrollspy } from './chunks/e6721ef6.js';
import { C as ComponentsPlugin, D as DirectivesPlugin } from './chunks/6ebfe45c.js';
export { B as BVConfig, B as BVConfigPlugin, a as ComponentPlugins, C as ComponentsPlugin, d as DirectivePlugins, D as DirectivesPlugin, L as LinkComponents, b as LinkPlugin, N as NavbarComponents, c as NavbarPlugin, V as VBmodalDirectives, e as VBmodalPlugin, f as VBpopoverDirectives, g as VBpopoverPlugin, h as VBscrollspyDirectives, i as VBscrollspyPlugin } from './chunks/6ebfe45c.js';

// BootstrapVue installer
const install = installFactory({ plugins: { ComponentsPlugin, DirectivesPlugin } });
const BootstrapVue = {
    install: install,
    setConfig: setConfig
};

export default BootstrapVue;
export { BootstrapVue, install };
