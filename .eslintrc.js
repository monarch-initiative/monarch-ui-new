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

  // rules overrides (KEEP THIS AS MINIMAL AS POSSIBLE)
  rules: {
    "vuejs-accessibility/anchor-has-content": [
      "error",
      {
        accessibleDirectives: ["tooltip"],
      },
    ],
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
