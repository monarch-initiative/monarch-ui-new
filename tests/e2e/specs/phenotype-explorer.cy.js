it("Populating example works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.contains("example").trigger("click");
  cy.get(".select-tags > .box > button").should("have.length.gt", 0);
});

it("Mode switching works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.contains("button", "these phenotypes").trigger("click");
  cy.contains("[role='option'] > *", "all human diseases").trigger("click");
  cy.contains("button", "all human diseases").trigger("click");
  cy.contains("[role='option'] > *", "all genes").trigger("click");
  cy.contains("button", "all genes").trigger("click");
});

/**
 * in these tests, test that phenogrid appears, but do not test phenogrid
 * functionality itself, as that is in the scope of the phenogrid repo
 */

it("Phenotype set vs gene/disease works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.contains("button", "these phenotypes").trigger("click");
  cy.contains("[role='option'] > *", "all genes").trigger("click");
  cy.get("input").paste("HP:0004970,HP:0004933,HP:0004927");
  cy.contains("Analyze").trigger("click");
  cy.contains("55");
  cy.contains("1600029I14Rik");
  cy.contains("Mus musculus");
  cy.contains("svg", "Pulmonary artery dilatation");
});

it("Phenotype set vs phenotype set works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.get("input").first().paste("HP:0004970,HP:0004933,HP:0004927");
  cy.get("input").last().paste("HP:0004970,HP:0004933,HP:0004927");
  cy.contains("Analyze").click();
  cy.contains("0");
  cy.contains("female sterile");
  cy.contains("svg", "female sterile");
});
