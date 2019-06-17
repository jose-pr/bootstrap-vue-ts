import '../chunks/fbe932e6.js';
import 'vue';
import '../chunks/04377600.js';
import { i as installFactory } from '../chunks/ca461e24.js';
import { V as VBModal } from '../chunks/e2797630.js';
export { a as VBModal } from '../chunks/e2797630.js';

const VBmodalDirectives = {
    VBModal: VBModal
};
//
//Plugin
//
const VBmodalPlugin = {
    install: installFactory({
        components: VBmodalDirectives
    })
};

export default VBmodalPlugin;
export { VBmodalDirectives, VBmodalPlugin };
