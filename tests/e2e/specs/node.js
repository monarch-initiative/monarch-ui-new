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

it("Title info shows", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.contains("Marfan syndrome");
  cy.contains("Disease");
  cy.contains("MONDO:0007947");
});

it("Overview items show", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.contains("MFS1");
  cy.contains("Marfan syndrome type 1");
  cy.contains("Marfan syndrome is a disorder of the connective tissue");
});

it("Details items show", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.contains("Autosomal dominant inheritance");
  cy.contains("NCIT:C34807");
  cy.contains("UMLS:C0024796");
});

it("Hierarchy items show", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.contains("syndromic myopia");
  cy.contains("connective tissue disease with eye involvement");
  cy.contains("lens position anomaly");
  cy.contains("SCTID:19346006");
  cy.contains("NCIT:C34807");
});

it("Gene specific info shows", () => {
  cy.visit("/gene/MONDO:0007947");

  cy.contains("Gene");
  cy.contains("Symbol");
  cy.contains("CDK2");
});

it("Publication specific info shows", () => {
  cy.visit("/publication/MONDO:0007947");

  cy.contains("Publication");
  cy.contains("Dimorphic effects of transforming growth factor-β signaling");
  cy.contains("Cook JR");
  cy.contains("Ramirez F");
  cy.contains("1. Arterioscler Thromb Vasc Biol. 2015 Apr;35(4):911-7.");
});

it("Summary association info shows", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.get(".result").contains("Marfan syndrome");
  cy.get(".result")
    .contains("Has Phenotype")
    .invoke("attr", "href")
    .should("equal", "http://purl.obolibrary.org/obo/RO_0002200");
  cy.get(".result")
    .contains("Dural ectasia")
    .invoke("attr", "href")
    .should("equal", "/phenotype/HP:0100775");

  cy.get(".result").contains("5 piece(s) of supporting evidence");
  cy.get(".result").contains("4 piece(s) of supporting evidence");
});

it("Table association info shows", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.contains("Table").trigger("click");
  cy.contains("tr", "Marfan syndrome");
  cy.contains("tr", "Has Phenotype")
    .contains("Has Phenotype")
    .invoke("attr", "href")
    .should("equal", "http://purl.obolibrary.org/obo/RO_0002200");
  cy.contains("tr", "Dural ectasia")
    .contains("Dural ectasia")
    .invoke("attr", "href")
    .should("equal", "/phenotype/HP:0100775");
});

it("Association mode switching works", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.contains("Table").trigger("click");
  cy.contains("button", "Phenotypes").trigger("click");
  cy.contains("[role='option'] > *", "Variants").trigger("click");
  cy.contains("th", "Variant");
});

it("Association table has extra metadata columns", () => {
  cy.visit("/disease/MONDO:0007947");

  cy.contains("Table").trigger("click");

  cy.contains("tr", "Frequent")
    .contains("Frequent")
    .invoke("attr", "href")
    .should("equal", "http://purl.obolibrary.org/obo/HP_0040282");

  cy.contains("button", "Phenotypes").as("category");

  cy.get("@category").trigger("click");
  cy.contains("[role='option'] > *", "Variants").trigger("click");
  cy.contains("td", "Mus musculus");
  cy.contains("th", "Taxon").find("button").trigger("click");
  cy.get("[role='listbox']").contains("Homo Sapiens");
  cy.get("[role='listbox']").contains("Mus Musculus");

  cy.get("@category").trigger("click");
  cy.contains("[role='option'] > *", "Publications").trigger("click");
  cy.contains("Author");
  cy.contains("Year");
  cy.contains("Publisher");
});
