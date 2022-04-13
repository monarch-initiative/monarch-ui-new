// cypress setup

import { setupWorker } from "msw";
import { handlers } from "../../fixtures";

// setup mock-service-worker for browser (cypress)
const worker = setupWorker(...handlers);
before(() => worker.start());
afterEach(() => worker.resetHandlers());
// after(() => worker.stop()); // leave this out so when running cypress gui you can still play around with mocked responses even after tests have finished running

// make "contains()" case-insensitive by default
// https://github.com/cypress-io/cypress/issues/6564
Cypress.Commands.overwrite(
  "contains",
  (originalFn, subject, filter, text, options = {}) => {
    options.matchCase = false;
    return originalFn(subject, filter, text, options);
  }
);
