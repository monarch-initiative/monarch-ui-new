it("Shows sub-header", () => {
  cy.visit("/disease/MONDO:0007947");
  cy.contains("Marfan syndrome");
  cy.contains("Disease");
  cy.contains("MONDO:0007947");
});

it("Table of contents works", () => {
  cy.visit("/disease/MONDO:0007947");

  // toggle button exists
  cy.get(".toc")
    .invoke("attr", "aria-label")
    .should("include", "table of contents");

  // starts closed (due to small screen size)
  cy.get(".toc button")
    .invoke("attr", "aria-expanded")
    .should("equal", "false");

  // click button to open
  cy.get(".toc").trigger("click");
  cy.get(".toc button").invoke("attr", "aria-expanded").should("equal", "true");

  // click off to close (with small screen size)
  cy.get("body").click(500, 500);
  cy.get(".toc button")
    .invoke("attr", "aria-expanded")
    .should("equal", "false");

  // open again and check contents
  cy.get(".toc").trigger("click");
  cy.contains(".toc", "Overview");
  cy.contains(".toc", "Hierarchy");
  cy.contains(".toc", "Associations");

  // check if solo selection mode works
  cy.get(".toc .checkbox").click(); // cypress click function needed here for some reason
  cy.get("main").contains("Overview").should("be.visible");
  cy.get("main").contains("Hierarchy").should("not.be.visible");
  cy.get("main").contains("Associations").should("not.be.visible");
  cy.get(".toc .checkbox").click();
  cy.get("main").contains("Hierarchy").should("be.visible");
  cy.get("main").contains("Associations").should("be.visible");
});
