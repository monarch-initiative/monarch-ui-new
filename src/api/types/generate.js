/* eslint-disable */

const { generateApi } = require("swagger-typescript-api");
const path = require("path");
const fs = require("fs");

// use swagger-typescript-api package to generate typescript types and api
// client automatically from biolink swagger schema

// run this script with node like:
// node ./src/api/types/generate.js

generateApi({
  name: "types.ts",
  output: path.resolve(process.cwd(), "./src/api/types"),
  url: "https://api.monarchinitiative.org/api/swagger.json",
  httpClientType: "fetch",
  generateRouteTypes: true,
  generateResponses: true,
  toJS: true,
  singleHttpClient: true,
})
  .then(({ files }) =>
    files.forEach(({ name, content }) =>
      fs.writeFileSync(name, content)
    )
  )
  .catch(console.error);
