import '../chunks/a6dd0dc4.js';
import 'vue';
import '../chunks/224339a2.js';
import { i as installFactory } from '../chunks/d4da053b.js';
import { V as VBScrollspy } from '../chunks/a0e91275.js';
export { S as ScrollSpy, a as VBScrollspy } from '../chunks/a0e91275.js';

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

export default VBscrollspyPlugin;
export { VBscrollspyDirectives, VBscrollspyPlugin };
