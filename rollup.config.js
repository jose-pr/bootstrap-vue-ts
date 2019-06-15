import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import typescript from '@wessberg/rollup-plugin-ts'
import postcss from 'rollup-plugin-postcss';
import inputs from './rollup.inputs'

export default {    
  input:inputs,
  output: [
  {
    dir:'dist/esm',
    format:'esm'
  }
],
  external: ['vue','vue-property-decorator','vue-class-component'],
  plugins: [
    commonjs(),
    vue({
        css: false
     }),
     typescript(),
    postcss({
        extract:true
    })
  ]
}