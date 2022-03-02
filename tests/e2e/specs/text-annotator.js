import example from "../../../src/views/explore/text-annotator.json";

it("Basic search results show", () => {
  cy.visit("/explore#text-annotator");
  cy.get("textarea").focus();
  cy.get("textarea").type(example.content.split("\n\n")[0]);
  cy.get("textarea").blur();

  cy.contains("Lewis (1978) found 7").should("exist");
  cy.contains("macromelanosomes").trigger("mouseenter");

  cy.contains("MP:0030917")
    .invoke("attr", "href")
    .should("includes", "MP:0030917");
  cy.contains("Giant melanosomes in melanocytes").should("exist");
});
