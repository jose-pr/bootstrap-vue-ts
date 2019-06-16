import './chunks/a38114fa.js';
import { T as TestPartial1 } from './chunks/1b6c0039.js';
import 'vue';
import './chunks/8ccf66f8.js';
import { i as installFactory, s as setConfig, v as vueUse } from './chunks/a31a6b53.js';
import './chunks/cc02fd47.js';
import './chunks/fe59a6ba.js';
import './chunks/19bc14e4.js';
import './chunks/20b2115e.js';
import { c as componentsPlugin, d as directivesPlugin } from './chunks/a3dbdf34.js';

// BootstrapVue installer
const install = installFactory({ plugins: { componentsPlugin, directivesPlugin } });
const BootstrapVue = {
    install: install,
    setConfig: setConfig
};

// Main entry point for the browser build
// Auto installation only occurs if window.Vue exists
vueUse(BootstrapVue);
console.log(TestPartial1());

export default BootstrapVue;
