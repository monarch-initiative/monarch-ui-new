module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",

  // only test *.test.ts files with jest
  testMatch: ["**/?(*.)+(test.ts)"],

  // jest needs its own loaders analogous to webpack loaders
  transform: {
    "\\.vue$": "vue-jest",
    "\\.yaml$": "jest-yaml-transform",
    "\\.md$": "jest-raw-loader",
    "\\.txt$": "jest-raw-loader",
  },

  // force babel to transpile everything in node_modules to avoid "import" errors
  // https://github.com/facebook/jest/issues/9292
  // https://www.npmjs.com/package/@vue/cli-plugin-unit-jest#transform-dependencies-from-node_modules
  transformIgnorePatterns: [],
};
