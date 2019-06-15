module.exports = {
  extends: [
    'standard',
    'plugin:vue/recommended',    
   // '@vue/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/typescript'
  ],
  plugins: ['@typescript-eslint', 'jest', 'markdown', 'node', 'promise'],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser', //parser: "@typescript-eslint/parser",
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  globals: {
    Vue: true
  },
  rules: {
    'spaced-comment': 'off', // needed to ignore `/*#__PURE__*/` comments
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'never',
          component: 'never'
        }
      }
    ],
    'vue/max-attributes-per-line': ['error', { singleline: 4 }],
    'vue/no-template-shadow': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/singleline-html-element-content-newline': 'off'
  }
}
