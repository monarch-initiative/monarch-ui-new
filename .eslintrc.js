module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["vuejs-accessibility"],
  extends: [
    "plugin:vue/vue3-essential",
    "plugin:vuejs-accessibility/recommended",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  // is this needed?
  overrides: [
    {
      files: [
        "**/tests/unit/**/*.test.ts",
        "**/tests/accessibility/**/*.test.ts",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
