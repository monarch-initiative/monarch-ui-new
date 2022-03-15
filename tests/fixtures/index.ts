import { rest } from "msw";

import datasets from "./datasets.json";
import ontologies from "./ontologies.json";
import uptime from "./uptime.json";
import feedback from "./feedback.json";
import nodeSearch from "./node-search.json";
import textAnnotator from "./text-annotator.json";
import phenotypeExplorerSearch from "./phenotype-explorer-search.json";
import phenotypeExplorerCompare from "./phenotype-explorer-compare.json";

// api calls to be mocked/stubbed with fixture data
export const handlers = [
  rest.get(/metadata\/datasets/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(datasets));
  }),
  rest.get(/obo.+ontologies/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(ontologies));
  }),
  rest.post(/api\.uptimerobot\.com/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(uptime));
  }),
  rest.post(/monarch-gh-issue-post/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(feedback));
  }),
  rest.get(/search\/entity/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(nodeSearch));
  }),
  rest.post(/nlp\/annotate/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(textAnnotator));
  }),
  rest.get(/sim\/search/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(phenotypeExplorerSearch));
  }),
  rest.post(/sim\/compare/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(phenotypeExplorerCompare));
  }),
];
