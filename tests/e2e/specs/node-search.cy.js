it("Redirects to explore page from home page", () => {
  cy.visit("/");
  cy.get("input").trigger("focus");
  cy.location().should((loc) => expect(loc.pathname).to.eq("/explore"));

  cy.visit("/");
  cy.contains("Text Annotator").as("button").trigger("click");
  cy.location().should((loc) => expect(loc.pathname).to.eq("/explore"));
});

it("Recent/frequent results show", () => {
  cy.visit("/explore");

  const searches = [
    "abc def",
    "123",
    "123",
    "abc def",
    "123",
    "123",
    "abc def",
  ];

  for (const search of searches) {
    cy.get("input").type(search);
    cy.get("input").trigger("change");
    cy.wait(500);
    cy.get(".textbox button").trigger("click");
    cy.wait(500);
  }

  cy.visit("/disease/MONDO:12345");
  cy.wait(500);

  cy.visit("/explore");
  cy.wait(500);

  cy.get("input").trigger("focus");
  cy.wait(500);

  /** recent */
  cy.get("[role='option']").eq(0).contains("marfan syndrome");
  cy.get("[role='option']").eq(1).contains("abc def");
  cy.get("[role='option']").eq(2).contains("123");

  /** frequent */
  cy.get("[role='option']").eq(3).contains("123");
  cy.get("[role='option']").eq(4).contains("abc def");
});

it("Autocomplete results show", () => {
  cy.visit("/explore");
  cy.get("input").type("Marfan");
  cy.contains("Marfan and Marfan-related disorder");
});

it("Basic search results show", () => {
  cy.visit("/explore");
  cy.get("input").type("Marfan");
  cy.get("input").trigger("change");

  cy.contains("neonatal Marfan syndrome").as("result");
  cy.get("@result")
    .invoke("attr", "href")
    .should("includes", "disease/MONDO:0017309");
});

it("Pagination works", () => {
  cy.visit("/explore");
  cy.get("input").type("Marfan");
  cy.get("input").trigger("change");

  cy.contains("1 to 10 of 61 results");
  cy.contains("button", /^2$/).trigger("click");
  cy.contains("11 to 20 of 61 results");
});

it("Filters show", () => {
  cy.visit("/explore");
  cy.get("input").type("Marfan");
  cy.get("input").trigger("change");

  cy.contains("Category").trigger("click");
  cy.contains(/Disease*.25/).should("exist");

  cy.contains("Taxon").trigger("click");
  cy.contains(/Gallus Gallus*.1/).should("exist");
});
