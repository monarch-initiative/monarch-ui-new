import { getNodeSearchResults } from "./../../src/api/node-search";

// expected results format
const result = {
  id: "MONDO:0017310",
  altIds: ["ORPHA:284993", "ORDO:284993", "Orphanet:284993", "UMLS:CN227112"],
  name: "Marfan and Marfan-related disorder",
  altNames: [],
  category: "disease",
  label: "Marfan and Marfan-related disorder",
  description: "",
  score: 108.652695,
  prefix: "MONDO",
  highlight:
    '<em class="hilite">Marfan</em> and <em class="hilite">Marfan</em>-related disorder',
};
const category = [
  {
    value: "disease",
    count: 25,
  },
  {
    value: "publication",
    count: 9,
  },
];

const taxon = [
  {
    value: "Gallus gallus",
    count: 1,
  },
  {
    value: "Homo sapiens",
    count: 1,
  },
];

test("Returns formatted results", async () => {
  const { count, results, facets } = await getNodeSearchResults("marfan");
  expect(count).toEqual(61);
  expect(results).toContainEqual(result);
  expect(facets.category).toEqual(expect.arrayContaining(category));
  expect(facets.taxon).toEqual(expect.arrayContaining(taxon));
});
