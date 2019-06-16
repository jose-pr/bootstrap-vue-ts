import commonjs from 'rollup-plugin-commonjs'
import typescript from '@wessberg/rollup-plugin-ts'
import nodeResolver from 'rollup-plugin-node-resolve'
import inputs from './rollup.inputs'

let plugins = [commonjs(), nodeResolver(), typescript()]
let globals = { vue: 'Vue' }
let externals = ['vue']
const DIST_PATH = './dist'
const SRC_PATH = './src'
const BROWSER_INDEX = `${SRC_PATH}/index.browser.ts`

export default [
  {
    input: {
      ...inputs,
      BootstrapVue: `${SRC_PATH}/index.ts`,
      BrowserBootstrapVue: BROWSER_INDEX
    },
    output: [
      {
        dir: `${DIST_PATH}/esm`,
        format: 'esm',
        globals: {
          vue: 'Vue'
        },
        chunkFileNames: 'chunks/[hash].js'
      }
    ],
    external: externals,
    plugins: plugins
  },
  {
    input: BROWSER_INDEX,
    output: [
      {
        file: `${DIST_PATH}/boostrap-vue.js`,
        format: 'umd',
        name: 'BootstrapVue',
        globals: globals
      }
    ],
    external: externals,
    plugins: plugins
  }
]
