module.exports = {
  extends: ['standard', 'plugin:vue/recommended', 'plugin:prettier/recommended',"plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
  plugins: ['jest', 'markdown', 'node', 'promise'],
  parserOptions: {
    parser: "@typescript-eslint/parser",
//    sourceType: 'module'
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

