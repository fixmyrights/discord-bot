const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  plugins: ['prettier'],
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    semi: 'off',
    'no-extra-semi': 'off',
    'no-debugger': isProduction ? 'error' : 'off'
  }
};
