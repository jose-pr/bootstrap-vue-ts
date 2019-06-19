import '../chunks/a6dd0dc4.js';
import 'vue';
import '../chunks/224339a2.js';
import { i as installFactory } from '../chunks/d4da053b.js';
import '../chunks/cc02fd47.js';
import { l as link } from '../chunks/803b0cbb.js';
export { o as omitLinkProps, b as pickLinkProps, a as props, p as propsFactory } from '../chunks/803b0cbb.js';

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
