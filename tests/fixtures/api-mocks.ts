import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import obo from "./obo.txt";
import uptime from "./uptime.json";
import feedback from "./feedback.json";

// api call mocks
export const axiosMock = new MockAdapter(axios);
axiosMock.onGet(/obo.+ontologies/i).reply(200, obo);
axiosMock.onPost(/api\.uptimerobot\.com/i).reply(200, uptime);
axiosMock.onPost(/monarch-gh-issue-post/i).reply(200, feedback);
