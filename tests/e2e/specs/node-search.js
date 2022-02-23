it("Redirects to explore page from home page", () => {
  cy.visit("/");
  cy.get("input").trigger("focus");
  cy.location().should((loc) => expect(loc.pathname).to.eq("/explore"));

  cy.visit("/");
  cy.contains("Text Annotator").as("button").trigger("click");
  cy.location().should((loc) => expect(loc.pathname).to.eq("/explore"));
});

it("Basic search results show", () => {
  cy.visit("/explore");
  cy.get("input").type("Marfan");

  cy.contains("neonatal Marfan syndrome").as("result");
  cy.get("@result")
    .invoke("attr", "href")
    .should("includes", "disease/MONDO:0017309");
});

it("Pagination works", () => {
  cy.visit("/explore");
  cy.get("input").type("Marfan");

  cy.contains("1 to 10 of 61 results");
  cy.contains("button", /^2$/).trigger("click");
  cy.contains("11 to 20 of 61 results");
});

it("Filters show", () => {
  cy.visit("/explore");
  cy.get("input").type("Marfan");

  cy.contains("Category").trigger("click");
  cy.contains(/Disease*.25/).should("exist");

  cy.contains("Taxon").trigger("click");
  cy.contains(/Gallus Gallus*.1/).should("exist");
});
