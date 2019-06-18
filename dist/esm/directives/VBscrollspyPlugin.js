import '../chunks/5cd47ea1.js';
import 'vue';
import '../chunks/87e3debe.js';
import { i as installFactory } from '../chunks/dafa5b20.js';
import { V as VBScrollspy } from '../chunks/e6721ef6.js';
export { S as ScrollSpy, a as VBScrollspy } from '../chunks/e6721ef6.js';

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
