import '../chunks/a6dd0dc4.js';
import 'vue';
import '../chunks/224339a2.js';
import { i as installFactory } from '../chunks/d4da053b.js';
import '../chunks/0fa52133.js';
import { V as VBToolTip } from '../chunks/6e3a15fa.js';
export { T as ToolTip, a as VBToolTip } from '../chunks/6e3a15fa.js';

const VBtooltipDirectives = {
    VBTooltip: VBToolTip
};
//
//Plugin
//
const VBtooltipPlugin = {
    install: installFactory({
        components: VBtooltipDirectives
    })
};

export default VBtooltipPlugin;
export { VBtooltipDirectives, VBtooltipPlugin };
