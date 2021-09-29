/* eslint @typescript-eslint/no-var-requires: "off" */
const SitemapPlugin = require("sitemap-webpack-plugin").default;
const { paths } = require("./src/router/sitemap.js");

// webpack plugin to generate sitemap with app build
const sitemapPlugin = new SitemapPlugin({
  base: process.env.VUE_APP_URL,
  paths,
});

module.exports = {
  // add plugins
  configureWebpack: {
    plugins: [sitemapPlugin],
  },
  // add extra file type loaders
  chainWebpack: (config) => {
    // markdown and raw text
    config.module
      .rule("raw")
      .test(/\.(md|txt)$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();

    // yaml
    config.module
      .rule("yaml")
      .test(/\.yaml$/)
      .type("json")
      .use("yaml-loader")
      .loader("yaml-loader")
      .end();
  },
  // configure dev options
  devServer: {
    // disable hot (state-preserving) reload on windows environments due to vue cli bugginess
    hot: process.env.NODE_ENV === "development" && process.platform !== "win32",
    // keep page auto-refresh when files change, because that's still nice
    liveReload: process.env.NODE_ENV === "development",
  },
  // sass options
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @use "@/global/variables.scss" as *;
        `,
      },
    },
  },
};
