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
import nodeHierarchy from "./node-hierarchy.json";
import nodeAssociations from "./node-associations.json";

// api calls to be mocked with fixture data
export const handlers = [
  // dynamically fetched data on /sources
  rest.get(/metadata\/datasets/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(datasets))
  ),
  rest.get(/obo.+ontologies/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(ontologies))
  ),

  // api status monitoring on /help
  rest.post(/api\.uptimerobot\.com/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(uptime))
  ),

  // submit feedback form
  rest.post(/monarch-gh-issue-post/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(feedback))
  ),

  // node search
  rest.get(/search\/entity/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(nodeSearch))
  ),

  // text annotator
  rest.post(/nlp\/annotate/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(textAnnotator))
  ),

  // phenotype explorer
  rest.get(/sim\/search/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(phenotypeExplorerSearch))
  ),
  rest.post(/sim\/compare/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(phenotypeExplorerCompare))
  ),

  // raw node search (without provided category)
  rest.get(/\/bioentity\/[^/]+$/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(nodeLookup))
  ),

  // node search
  rest.get(/\/bioentity\/\w+\/[^/]+$/i, (req, res, ctx) => {
    // change category of fixture data based on request so we can see UI that
    // is conditional on category
    const category =
      (req.url.pathname.match(/\/bioentity\/(.+)\//) || [])[1] || "";
    nodeLookup.category = [category];
    // note that this will show (in yarn test:gui) silly things like
    // "Marfan syndrome: gene", because only the category field is changed

    return res(ctx.status(200), ctx.json(nodeLookup));
  }),

  // node gene info
  rest.get(/mygene\.info/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(nodeGene))
  ),

  // node publication info
  rest.get(/esummary\.fcgi/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(nodePublicationSummary))
  ),
  rest.get(/efetch\.fcgi/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(nodePublicationAbstract))
  ),

  // node hierarchy info
  rest.get(/graph\/edges\/from/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(nodeHierarchy))
  ),

  // node associations data
  rest.get(/\/bioentity\/\w+\/[^/]+\/\w+.*$/i, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(nodeAssociations))
  ),
];
