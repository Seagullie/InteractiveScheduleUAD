console.log("Running .eslintrc.js")

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["google"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "require-jsdoc": ["off"],
    indent: ["off"],
    "quote-props": ["off"],
    quotes: ["off"],
    "linebreak-style": ["off"],
    // "max-len": ["off"],
    "object-curly-spacing": ["off"],
    "comma-dangle": ["off"],
    "no-unused-vars": ["off"],
    "prefer-const": ["off"],
    "no-var": ["off"],
    "no-undef": ["warn"],
    "no-trailing-spaces": ["off"],
    curly: ["off"],
    "operator-linebreak": ["off"],
    "brace-style": ["off"],
    semi: ["off"],
    "max-len": ["off"],
    "valid-jsdoc": ["off"],

    // "max-lines-per-function": ["error", { max: 40, skipComments: true }],
    "max-lines-per-function": ["warn", { max: 40 }],
    "space-before-function-paren": ["off"],
    "new-cap": ["off"], // allow capitalization of functions other than classes
  },
}
