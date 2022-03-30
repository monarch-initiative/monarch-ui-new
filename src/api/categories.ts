import { startCase } from "lodash";

// TODO: POSSIBLY BRING BACK THIS HARD-CODED MAPPING
// SEE: https://github.com/monarch-initiative/monarch-ui-new/issues/77

/* 

// this is a simplified (but hopefully equivalent) port of the code in:
// https://github.com/monarch-initiative/monarch-ui/blob/master/src/lib/category-map.js

// manually map category parts
const map: Record<string, Category> = {
  gene: "gene",
  variant: "variant",
  "sequence feature": "variant",
  genotype: "genotype",
  phenotype: "phenotype",
  disease: "disease",
  pathway: "pathway",
  "anatomical entity": "anatomy",
  publication: "publication",
  case: "case",
  "cell line": "model",
  organism: "model",
};

// turn category (array of category "parts") into single, supported category string
export const mapCategory = (category: Array<string>): Category => {
  // map category parts based on manual map
  const mappedCategory = [...new Set(category.map((part) => map[part]))];

  // prioritize genes and variants if matched
  if (mappedCategory.includes("gene")) return "gene";
  if (mappedCategory.includes("variant")) return "variant";

  // otherwise just return map of first category part
  return mappedCategory[0] || "unknown";
};

type Category = typeof categories[number];

*/

// temporary simplified version of function in comments above
export const mapCategory = (category: Array<string> = []): string =>
  category[0] || "unknown";

// because biolink is inconsistent with category names, these mappings are needed

// from a category name, get its pluralized form, for querying association endpoints
export const getAssociationEndpoint = (category = ""): string => {
  // special
  if (category === "anatomy") return "expression/anatomy";
  if (category === "ortholog-phenotype") return "ortholog/phenotypes";
  if (category === "ortholog-disease") return "ortholog/diseases";

  // causal/correlated
  if (category === "causal-disease" || category === "correlated-disease")
    return "diseases";
  if (category === "causal-gene" || category === "correlated-gene")
    return "genes";

  // non-pluralized
  if (category === "function") return category;

  // regular pluralized (most cases)
  return `${category}s`;
};

// from a category name, get how it should be labeled when viewing associations
export const getAssociationName = (category = ""): string => {
  // special
  if (category === "ortholog-phenotype") return "Ortholog Phenotypes";
  if (category === "ortholog-disease") return "Ortholog Diseases";

  // causal/correlated
  if (category === "causal-disease") return "Causal Diseases";
  if (category === "correlated-disease") return "Correlated Diseases";
  if (category === "causal-gene") return "Causal Genes";
  if (category === "correlated-gene") return "Correlated Genes";

  // regular pluralized (most cases)
  return `${startCase(category)}s`;
};

// categories that app supports
// keep in specific order of "importance", used for sorting
export const categories = [
  "phenotype",
  "disease",
  "gene",
  "variant",
  "genotype",
  "anatomy",
  "pathway",
  "homolog",
  "interaction",
  "publication",
  "model",
  "case",
  "cell-line",
  "function",
  "ortholog-disease",
  "ortholog-phenotype",
  "causal-disease",
  "correlated-disease",
  "causal-gene",
  "correlated-gene",
];
