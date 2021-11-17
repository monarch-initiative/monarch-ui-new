import { fixtures } from "../../fixtures";

beforeEach(() => {
  for (const [method, url, filename] of fixtures)
    cy.intercept(method, url, { fixture: filename });
});
