import { i as installFactory, p as pluginFactory } from './dafa5b20.js';
import { l as link } from './fca9d7f0.js';
import { B as BNavbarNav, a as BNavbar } from './87e7097d.js';
import { V as VBModal } from './ef478248.js';
import { V as VBPopover } from './3e54c52b.js';
import { V as VBScrollspy } from './e6721ef6.js';

const LinkComponents = {
    BLink: link
};
//
//Plugin
//
const LinkPlugin = {
    install: installFactory({
        components: LinkComponents
    })
};

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

const ComponentPlugins = {
    LinkPlugin,
    NavbarPlugin
};
const ComponentsPlugin = {
    install: installFactory({
        components: ComponentPlugins
    })
};

const VBmodalDirectives = {
    VBModal: VBModal
};
//
//Plugin
//
const VBmodalPlugin = {
    install: installFactory({
        components: VBmodalDirectives
    })
};

const VBpopoverDirectives = {
    VBPopover: VBPopover
};
//
//Plugin
//
const VBpopoverPlugin = {
    install: installFactory({
        components: VBpopoverDirectives
    })
};

const VBscrollspyDirectives = {
    VBScrollspy: VBScrollspy
};
//
//Plugin
//
const VBscrollspyPlugin = {
    install: installFactory({
        components: VBscrollspyDirectives
    })
};

const DirectivePlugins = {
    VBmodalPlugin,
    VBpopoverPlugin,
    VBscrollspyPlugin
};
const DirectivesPlugin = {
    install: installFactory({
        components: DirectivePlugins
    })
};

//
const BVConfigPlugin = /* #__PURE__ */ pluginFactory();

export { BVConfigPlugin as B, ComponentsPlugin as C, DirectivesPlugin as D, LinkComponents as L, NavbarComponents as N, VBmodalDirectives as V, ComponentPlugins as a, LinkPlugin as b, NavbarPlugin as c, DirectivePlugins as d, VBmodalPlugin as e, VBpopoverDirectives as f, VBpopoverPlugin as g, VBscrollspyDirectives as h, VBscrollspyPlugin as i };
