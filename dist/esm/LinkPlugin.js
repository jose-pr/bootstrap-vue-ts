import './chunk-f3e511bd.js';
import './chunk-efcf0387.js';
import 'vue';
import './chunk-2cd43649.js';
import { i as installFactory } from './chunk-2cc6687b.js';
import './chunk-cc02fd47.js';
import { l as link } from './chunk-9f07a9fc.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from './chunk-9f07a9fc.js';

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
