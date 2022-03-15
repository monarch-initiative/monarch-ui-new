it("Populating example works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.contains("try an example").trigger("click");
  cy.get(".select-tags > .box > button").should("have.length.gt", 0);
});

it("Mode switching works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.contains("mouse").should("exist");
  cy.contains("button", "all genes").trigger("click");
  cy.contains("[role='option']", "all human diseases").trigger("click");
  cy.contains("mouse").should("not.exist");
  cy.contains("button", "all human diseases").trigger("click");
  cy.contains("[role='option']", "these phenotypes").trigger("click");
  cy.get(".select-tags").should("have.length", 2);
});

it("Phenotype set vs gene/disease works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.get("input")
    .invoke("val", "HP:0004970,HP:0004933,HP:0004927")
    .trigger("input");
  cy.contains("Analyze").trigger("click");
  cy.contains("55");
  cy.contains("1600029I14Rik");
});

it("Phenotype set vs phenotype set works", () => {
  cy.visit("/explore#phenotype-explorer");
  cy.contains("button", "all genes").trigger("click");
  cy.contains("[role='option']", "these phenotypes").trigger("click");
  cy.get("input")
    .first()
    .invoke("val", "HP:0004970,HP:0004933,HP:0004927")
    .trigger("input");
  cy.get("input")
    .last()
    .invoke("val", "HP:0004970,HP:0004933,HP:0004927")
    .trigger("input");
  cy.contains("Analyze").trigger("click");
  cy.contains("0");
  cy.contains("female sterile");
});
