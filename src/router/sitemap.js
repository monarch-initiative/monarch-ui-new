// list of static paths to include in generated sitemap
// gets imported to sitemap-webpack-plugin in vue.config.js
module.exports = {
  paths: ["/"],
};

// cannot get this automatically from router routes due to commonjs and esm
// incompatibility, and because we want to add a long list of pre-selected
// dynamic routes (e.g. cool diseases, genes, etc.)
