import { rest } from "msw";

import obo from "raw-loader!./obo.txt";
import uptime from "./uptime.json";
import feedback from "./feedback.json";

// api calls to be mocked/stubbed with fixture data
export const handlers = [
  rest.get(/obo.+ontologies/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.text(obo));
  }),
  rest.post(/api\.uptimerobot\.com/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(uptime));
  }),
  rest.post(/monarch-gh-issue-post/i, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(feedback));
  }),
];
