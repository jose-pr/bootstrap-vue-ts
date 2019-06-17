import { i as installFactory, p as pluginFactory } from './ca461e24.js';
import { l as link } from './ef49def3.js';
import { B as BNavbarNav, a as BNavbar } from './9a621529.js';
import { V as VBModal } from './e2797630.js';
import { V as VBPopover } from './cbc00e7e.js';

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

const DirectivePlugins = {
    VBmodalPlugin,
    VBpopoverPlugin
};
const DirectivesPlugin = {
    install: installFactory({
        components: DirectivePlugins
    })
};

//
const BVConfigPlugin = /* #__PURE__ */ pluginFactory();

export { BVConfigPlugin as B, ComponentsPlugin as C, DirectivesPlugin as D, LinkComponents as L, NavbarComponents as N, VBmodalDirectives as V, ComponentPlugins as a, LinkPlugin as b, NavbarPlugin as c, DirectivePlugins as d, VBmodalPlugin as e, VBpopoverDirectives as f, VBpopoverPlugin as g };
