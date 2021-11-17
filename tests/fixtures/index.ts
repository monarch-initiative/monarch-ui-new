import obo from "raw-loader!./obo.txt";
import uptime from "./uptime.json";
import feedback from "./feedback.json";

// abstraction format usable with jest (axios mock) and cypress (intercept)
type Fixture = [
  string, // request method
  RegExp | string, // url match
  string, // filename of fixture
  string | Record<string, unknown> // actual data of fixture
];

// api calls to be mocked/stubbed with fixture data
export const fixtures: Array<Fixture> = [
  ["GET", /obo.+ontologies/i, "obo.txt", obo],
  ["POST", /api\.uptimerobot\.com/i, "uptime.json", uptime],
  ["POST", /monarch-gh-issue-post/i, "feedback.json", feedback],
];
