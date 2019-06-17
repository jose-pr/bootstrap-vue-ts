import '../chunks/fbe932e6.js';
import 'vue';
import '../chunks/04377600.js';
import { i as installFactory } from '../chunks/ca461e24.js';
import '../chunks/cc02fd47.js';
import { l as link } from '../chunks/ef49def3.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from '../chunks/ef49def3.js';

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

export default LinkPlugin;
export { LinkComponents, LinkPlugin };
