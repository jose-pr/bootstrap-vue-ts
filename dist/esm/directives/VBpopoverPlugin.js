import '../chunks/5cd47ea1.js';
import 'vue';
import '../chunks/87e3debe.js';
import { i as installFactory } from '../chunks/dafa5b20.js';
import { V as VBPopover } from '../chunks/3e54c52b.js';
export { P as PopOver, a as VBPopover } from '../chunks/3e54c52b.js';

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
