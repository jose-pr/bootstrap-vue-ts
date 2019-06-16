import '../chunks/a38114fa.js';
import '../chunks/1b6c0039.js';
import 'vue';
import '../chunks/8ccf66f8.js';
import { i as installFactory } from '../chunks/a31a6b53.js';
import { V as VBModal } from '../chunks/20b2115e.js';
export { a as VBModal } from '../chunks/20b2115e.js';

const VBModalDirectives = {
    VBModal: VBModal,
};
//
//Plugin
//
const VBModalPlugin = {
    install: installFactory({ components: VBModalDirectives })
};

export default VBModalPlugin;
export { VBModalDirectives, VBModalPlugin };
