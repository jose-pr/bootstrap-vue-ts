import '../chunks/a38114fa.js';
import '../chunks/1b6c0039.js';
import 'vue';
import '../chunks/8ccf66f8.js';
import { i as installFactory } from '../chunks/a31a6b53.js';
import '../chunks/cc02fd47.js';
import { l as link } from '../chunks/fe59a6ba.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from '../chunks/fe59a6ba.js';

const LinkComponents = {
    BLink: link,
};
//
//Plugin
//
const LinkPlugin = {
    install: installFactory({ components: LinkComponents })
};

export default LinkPlugin;
export { LinkComponents, LinkPlugin };
