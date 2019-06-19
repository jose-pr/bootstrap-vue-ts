import { i as installFactory } from './d4da053b.js';
import { V as VBToolTip } from './6e3a15fa.js';

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

export { VBtooltipPlugin as V, VBtooltipDirectives as a, VBtooltipPlugin as b };
