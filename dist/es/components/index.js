import { installFactory } from '../core/BvPlugin';
import LinkPlugin from './link';
import NavbarPlugin from './navbar';
export const componentPlugins = {
    LinkPlugin,
    NavbarPlugin
};
export const componentsPlugin = {
    install: installFactory({ plugins: componentPlugins })
};
export * from './link';
export * from './navbar';
