describe("App renders", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.get("#app").should("not.be.empty");
  });
});
