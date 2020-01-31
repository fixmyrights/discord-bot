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
    'no-extra-semi': 'off',
    semi: 'off'
  }
};
