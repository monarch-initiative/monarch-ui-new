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

// categories that app supports
export const categories = [
  "unknown",
  "anatomy",
  "case",
  "cell-line",
  "disease",
  "function",
  "gene",
  "genotype",
  "homolog",
  "interaction",
  "model",
  "ortholog-disease",
  "ortholog-phenotype",
  "pathway",
  "phenotype",
  "publication",
  "variant",
] as const;

type Category = typeof categories[number];
