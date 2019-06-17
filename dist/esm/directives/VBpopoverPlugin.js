import '../chunks/fbe932e6.js';
import 'vue';
import '../chunks/04377600.js';
import { i as installFactory } from '../chunks/ca461e24.js';
import { V as VBPopover } from '../chunks/cbc00e7e.js';
export { a as VBPopover } from '../chunks/cbc00e7e.js';

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

export default VBpopoverPlugin;
export { VBpopoverDirectives, VBpopoverPlugin };
