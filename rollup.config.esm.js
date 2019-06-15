import commonjs from 'rollup-plugin-commonjs'
import typescript from '@wessberg/rollup-plugin-ts'
import nodeResolver from 'rollup-plugin-node-resolve'
import inputs from './rollup.inputs'

export default {
  input: inputs,
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      globals: {
        vue: 'Vue'
      }
    }
  ],
  external: ['vue'],
  plugins: [commonjs(), nodeResolver(), typescript()]
}
