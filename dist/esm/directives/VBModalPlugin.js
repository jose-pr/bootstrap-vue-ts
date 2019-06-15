import '../chunks/f3e511bd.js';
import '../chunks/efcf0387.js';
import 'vue';
import '../chunks/2cd43649.js';
import { i as installFactory } from '../chunks/2cc6687b.js';
import { V as VBModal } from '../chunks/8a0e383a.js';
export { a as VBModal } from '../chunks/8a0e383a.js';

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
