// cypress setup

import { setupWorker } from "msw";
import { handlers } from "../../fixtures";

// setup mock-service-worker for browser (cypress)
const worker = setupWorker(...handlers);
before(() => worker.start());
afterEach(() => worker.resetHandlers());
// after(() => worker.stop()); // leave this out so when running cypress gui you can still play around with mocked responses even after tests have finished running
