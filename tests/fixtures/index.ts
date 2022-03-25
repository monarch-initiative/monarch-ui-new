import { rest } from "msw";

import datasets from "./datasets.json";
import ontologies from "./ontologies.json";
import uptime from "./uptime.json";
import feedback from "./feedback.json";
import nodeSearch from "./node-search.json";
import textAnnotator from "./text-annotator.json";
import phenotypeExplorerSearch from "./phenotype-explorer-search.json";
import phenotypeExplorerCompare from "./phenotype-explorer-compare.json";
import nodeLookup from "./node-lookup.json";
import nodeGene from "./node-gene.json";
import nodePublicationSummary from "./node-publication-summary.json";
import { text as nodePublicationAbstract } from "./node-publication-abstract.json";

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
  rest.get(/\/bioentity\//i, (req, res, ctx) => {
    // change category of fixture data based on request so we can see UI that
    // is conditional on category
    const category =
      (req.url.pathname.match(/\/api\/bioentity\/(.*)\//) || [])[1] || "";
    nodeLookup.category = [category];
    // note that this will show (in yarn test:gui) silly things like
    // "Marfan syndrome: gene", because only the category field is changed

    return res(ctx.status(200), ctx.json(nodeLookup));
  }),
  rest.get(/mygene\.info/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(nodeGene));
  }),
  rest.get(/esummary\.fcgi/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(nodePublicationSummary));
  }),
  rest.get(/efetch\.fcgi/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(nodePublicationAbstract));
  }),
];
