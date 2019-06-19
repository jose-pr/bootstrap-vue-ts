import '../chunks/a6dd0dc4.js';
import 'vue';
import '../chunks/224339a2.js';
import { i as installFactory } from '../chunks/d4da053b.js';
import { V as VBToggle } from '../chunks/ecb7ab0c.js';
export { a as VBToggle } from '../chunks/ecb7ab0c.js';

const VBtoggleDirectives = {
    VBToggle: VBToggle
};
//
//Plugin
//
const VBtogglePlugin = {
    install: installFactory({
        components: VBtoggleDirectives
    })
};

export default VBtogglePlugin;
export { VBtoggleDirectives, VBtogglePlugin };
