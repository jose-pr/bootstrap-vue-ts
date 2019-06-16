// Main entry point for the browser build
import { vueUse } from './core/BvPlugin';
import BootstrapVue from './index';
import { TestPartial1, TestPartial3 } from './utils';
// Auto installation only occurs if window.Vue exists
vueUse(BootstrapVue);
let t = TestPartial3();
console.log(TestPartial1());
export default BootstrapVue;
