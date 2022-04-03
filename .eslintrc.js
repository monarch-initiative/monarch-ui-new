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

  // rule overrides (KEEP THIS AS MINIMAL AS POSSIBLE)
  rules: {
    // count v-tippy (which adds an accessible aria-label attribute) as accessible
    "vuejs-accessibility/anchor-has-content": [
      "error",
      {
        accessibleDirectives: ["tippy"],
      },
    ],
    // allow nesting a control in a label without a for attribute (perfectly fine practice)
    "vuejs-accessibility/label-has-for": [
      "error",
      {
        required: {
          some: ["nesting", "id"],
        },
        allowChildren: true,
      },
    ],
  },

  // TODO: replace with env: "vue/setup-compiler-macros": true after upgrade to eslint-plugin-vue ^8.0.0
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    withDefaults: "readonly",
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
