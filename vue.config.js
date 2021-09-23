module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("yaml")
      .test(/\.yaml$/)
      .type("json")
      .use("yaml-loader")
      .loader("yaml-loader")
      .end();
  },
};
