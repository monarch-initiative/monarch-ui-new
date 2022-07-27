import example from "@/views/explore/text-annotator.json";

it("Basic search results show", () => {
  cy.visit("/explore#text-annotator");
  cy.get("textarea").focus();
  cy.get("textarea").type(example.content.slice(0, 100));
  cy.get("textarea").blur();

  cy.contains("Lewis (1978) found 7").should("exist");
  cy.contains("affected").trigger("mouseenter");

  cy.contains("HP:0032320")
    .invoke("attr", "href")
    .should("includes", "HP:0032320");
  cy.contains("acts upstream of or within").should("exist");
});
