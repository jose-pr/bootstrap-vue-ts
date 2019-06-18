import '../chunks/5cd47ea1.js';
import 'vue';
import '../chunks/87e3debe.js';
import { i as installFactory } from '../chunks/dafa5b20.js';
import { V as VBModal } from '../chunks/ef478248.js';
export { a as VBModal } from '../chunks/ef478248.js';

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
