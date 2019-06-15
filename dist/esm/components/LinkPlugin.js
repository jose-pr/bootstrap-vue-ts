import '../chunks/f3e511bd.js';
import '../chunks/efcf0387.js';
import 'vue';
import '../chunks/2cd43649.js';
import { i as installFactory } from '../chunks/2cc6687b.js';
import '../chunks/cc02fd47.js';
import { l as link } from '../chunks/9f07a9fc.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from '../chunks/9f07a9fc.js';

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
