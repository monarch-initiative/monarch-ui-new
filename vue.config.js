module.exports = {
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
          @use "@/global/mixins.scss" as *;
        `,
      },
    },
  },
  configureWebpack: {
    plugins: [
      // export webpack-generated stats of compiled bundle for analysis
      // eslint-disable-next-line
      // new (require("stats-webpack-plugin"))("stats.json"),
    ],
  },
};
