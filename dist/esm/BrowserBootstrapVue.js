import { Y as TestPartial1 } from './chunks/5cd47ea1.js';
import 'vue';
import './chunks/87e3debe.js';
import { i as installFactory, s as setConfig, v as vueUse } from './chunks/dafa5b20.js';
import './chunks/cc02fd47.js';
import './chunks/fca9d7f0.js';
import './chunks/87e7097d.js';
import './chunks/ef478248.js';
import './chunks/3e54c52b.js';
import './chunks/e6721ef6.js';
import { C as ComponentsPlugin, D as DirectivesPlugin } from './chunks/6ebfe45c.js';

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
