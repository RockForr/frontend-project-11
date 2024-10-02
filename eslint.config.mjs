import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    ignores: ["dist/", "playwright.config.js", "tests-examples", "tests/", "webpack.config.js"]
  },
  { 
    rules: 
    {
      'no-param-reassign' : 'off',
    },
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];