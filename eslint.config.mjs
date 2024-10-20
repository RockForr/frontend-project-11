import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    ignores: ['dist/', 'webpack.config.js', 'eslint.config.mjs'],
  },
  {
    rules:
    {
      'no-param-reassign': 'off',
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
