import { installFactory } from '../../core/BvPlugin';
//
//Import all directives
//
import * as VBModalDirective from './modal';
export const VBModalDirectives = {
    VBModal: VBModalDirective.default,
};
//
//Plugin
//
const VBModalPlugin = {
    install: installFactory({ components: VBModalDirectives })
};
//
//Exports
//
export default VBModalPlugin;
export { VBModalPlugin };
export * from './modal';
