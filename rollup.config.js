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
      }
    }
  ],
  external: ['vue', 'vue-property-decorator', 'vue-class-component'],
  plugins: [commonjs(), nodeResolver(), typescript()]
}
