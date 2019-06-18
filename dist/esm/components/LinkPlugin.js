import '../chunks/5cd47ea1.js';
import 'vue';
import '../chunks/87e3debe.js';
import { i as installFactory } from '../chunks/dafa5b20.js';
import '../chunks/cc02fd47.js';
import { l as link } from '../chunks/fca9d7f0.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from '../chunks/fca9d7f0.js';

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
