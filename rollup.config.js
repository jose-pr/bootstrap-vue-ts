import commonjs from 'rollup-plugin-commonjs'
import typescript from '@wessberg/rollup-plugin-ts'
import nodeResolver from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.browser.ts',
  output: [
    {
      file: 'dist/boostrap-vue.js',
      format: 'umd',
      name: 'BootstrapVue',
      globals: {
        vue: 'Vue'
      },
      entryFileNames: 'chunks/[hash].js'
    }
  ],
  external: ['vue'],
  plugins: [commonjs(), nodeResolver(), typescript()]
}
