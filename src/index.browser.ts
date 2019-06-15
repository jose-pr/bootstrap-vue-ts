// Main entry point for the browser build
import { vueUse } from './common/BvPlugin'

import BootstrapVue from './index'

// Auto installation only occurs if window.Vue exists
vueUse(BootstrapVue)

export default BootstrapVue
