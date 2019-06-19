import { a3 as TestPartial1 } from './chunks/a6dd0dc4.js';
import 'vue';
import './chunks/224339a2.js';
import { i as installFactory, s as setConfig, v as vueUse } from './chunks/d4da053b.js';
import './chunks/cc02fd47.js';
import './chunks/803b0cbb.js';
import './chunks/5aae1bf9.js';
import './chunks/edb80088.js';
import './chunks/0fa52133.js';
import './chunks/6e3a15fa.js';
import './chunks/cfdbb5bc.js';
import './chunks/88fded6a.js';
import './chunks/a0e91275.js';
import './chunks/ecb7ab0c.js';
import { C as ComponentsPlugin, D as DirectivesPlugin } from './chunks/c6faf9c8.js';

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
