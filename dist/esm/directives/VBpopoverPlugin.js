import '../chunks/a6dd0dc4.js';
import 'vue';
import '../chunks/224339a2.js';
import { i as installFactory } from '../chunks/d4da053b.js';
import '../chunks/0fa52133.js';
import '../chunks/6e3a15fa.js';
import '../chunks/cfdbb5bc.js';
import { V as VBPopover } from '../chunks/88fded6a.js';
export { P as PopOver, a as VBPopover } from '../chunks/88fded6a.js';

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
