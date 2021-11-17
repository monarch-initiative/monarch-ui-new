it("Feedback form can open and close", () => {
  // setup
  cy.visit("/");

  // get open feedback form button
  cy.get("button[aria-label*='feedback']").first().as("open");

  // open feedback form modal
  cy.get("@open").click();

  // see if modal has opened and shown feedback form correctly
  cy.get(".modal").contains("Feedback Form").should("be.visible");

  // click in middle of modal, which should not close modal
  cy.get(".modal").first().click();
  cy.get(".modal").should("be.visible");

  // click in overlay in corner, which should close modal
  cy.get(".overlay").first().click(10, 10);
  cy.get(".modal").should("not.exist");

  // reopen and make sure pressing esc closes
  cy.get("@open").click();
  cy.window().trigger("keydown", { key: "Escape" });
  cy.window().trigger("keypress", { key: "Escape" });
  cy.get(".modal").should("not.exist");

  // reopen and make sure x button closes
  cy.get("@open").click();
  cy.get(".modal button").first().click(); // close button should always be first button in dom order
  cy.get(".modal").should("not.exist");
});
