import './chunk-1bdb7d0e.js';
import 'vue';
import './chunk-39591e18.js';
import { i as installFactory } from './chunk-3491bae3.js';
import './chunk-cc02fd47.js';
import { l as link } from './chunk-3030e0e6.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from './chunk-3030e0e6.js';

const LinkComponents = {
    BLink: link
};
//
// Plugin
//
const LinkPlugin = {
    install: installFactory({ components: LinkComponents })
};

export default LinkPlugin;
export { LinkComponents, LinkPlugin };
