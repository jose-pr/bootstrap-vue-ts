import { i as installFactory, p as pluginFactory } from './d4da053b.js';
import { l as link } from './803b0cbb.js';
import { B as BNavbarNav, a as BNavbar } from './5aae1bf9.js';
import { V as VBModal } from './edb80088.js';
import './6e3a15fa.js';
import { V as VBtooltipPlugin } from './cfdbb5bc.js';
import { V as VBPopover } from './88fded6a.js';
import { V as VBScrollspy } from './a0e91275.js';
import { V as VBToggle } from './ecb7ab0c.js';

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

const VBtoggleDirectives = {
    VBToggle: VBToggle
};
//
//Plugin
//
const VBtogglePlugin = {
    install: installFactory({
        components: VBtoggleDirectives
    })
};

const DirectivePlugins = {
    VBmodalPlugin,
    VBpopoverPlugin,
    VBscrollspyPlugin,
    VBtogglePlugin,
    VBtooltipPlugin
};
const DirectivesPlugin = {
    install: installFactory({
        components: DirectivePlugins
    })
};

//
const BVConfigPlugin = /* #__PURE__ */ pluginFactory();

export { BVConfigPlugin as B, ComponentsPlugin as C, DirectivesPlugin as D, LinkComponents as L, NavbarComponents as N, VBmodalDirectives as V, ComponentPlugins as a, LinkPlugin as b, NavbarPlugin as c, DirectivePlugins as d, VBmodalPlugin as e, VBpopoverDirectives as f, VBpopoverPlugin as g, VBscrollspyDirectives as h, VBscrollspyPlugin as i, VBtoggleDirectives as j, VBtogglePlugin as k };
