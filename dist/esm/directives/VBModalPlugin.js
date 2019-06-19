import '../chunks/a6dd0dc4.js';
import 'vue';
import '../chunks/224339a2.js';
import { i as installFactory } from '../chunks/d4da053b.js';
import { V as VBModal } from '../chunks/edb80088.js';
export { a as VBModal } from '../chunks/edb80088.js';

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
