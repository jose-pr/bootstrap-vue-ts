import { installFactory } from '../common/BvPlugin'
import VBModalPlugin, {  } from './modal'
export const directivePlugins = {
    VBModalPlugin,
}
export const directivesPlugin = {
    install: installFactory({ plugins: directivePlugins })
}
export * from './modal'
