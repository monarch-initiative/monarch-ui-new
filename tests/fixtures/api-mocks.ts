import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import obo from "./obo.txt";

// api call mocks
const axiosMock = new MockAdapter(axios);
axiosMock.onGet(/obo.+ontologies/i).reply(200, obo);
