import { T as TestPartial1 } from './chunks/fbe932e6.js';
import 'vue';
import './chunks/04377600.js';
import { i as installFactory, s as setConfig, v as vueUse } from './chunks/ca461e24.js';
import './chunks/cc02fd47.js';
import './chunks/ef49def3.js';
import './chunks/9a621529.js';
import './chunks/e2797630.js';
import './chunks/cbc00e7e.js';
import { C as ComponentsPlugin, D as DirectivesPlugin } from './chunks/bb55e737.js';

// BootstrapVue installer
const install = installFactory({ plugins: { ComponentsPlugin, DirectivesPlugin } });
const BootstrapVue = {
    install: install,
    setConfig: setConfig
};

// Main entry point for the browser build
// Auto installation only occurs if window.Vue exists
vueUse(BootstrapVue);
console.log(TestPartial1());

export default BootstrapVue;
