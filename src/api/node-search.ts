import { biolink, request, cleanError, ApiError } from ".";
import { Options } from "./../components/AppSelectMulti.d";
import { mapCategory } from "./categories";
import { labelToId } from "./taxons";

interface Response {
  numFound: number;
  docs: Array<{
    id: string;
    category?: Array<string>;
    equivalent_curie?: Array<string>;
    definition?: Array<string>;
    label?: Array<string>;
    score?: number;
    prefix?: string;
  }>;
  facet_counts: Record<string, Record<string, number>>;
  highlighting: Record<
    string,
    {
      highlight?: string;
    }
  >;
}

// get results from node search text and filters
export const getNodeSearchResults = async (
  search = "",
  availableFilters: Record<string, Options> = {},
  activeFilters: Record<string, Options> = {},
  start = 0
): Promise<Result> => {
  try {
    // if nothing searched, return empty results (no empty error status)
    if (!search.trim()) return { count: 0, results: [], facets: {} };

    // get facet params
    let params: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(activeFilters)) {
      // transform filter
      let filter = (value || [])
        // turn array of option objects into plain array of values
        .map(({ value }) => String(value))
        // remove empty
        .filter((value) => value.trim());

      // do special mapping
      if (key === "taxon") filter = filter.map(labelToId);

      // sort to make consistent for caching
      filter.sort();
      // join into comma-separated string list for request
      const string = filter.join(",");

      // if all available filters are active
      const allActive =
        activeFilters[key].length === availableFilters[key].length;

      // ignore filter if value "empty" (none active) or "full" (all active)
      if (string && !allActive) params[key] = string;
    }

    // other params
    params = {
      ...params,
      boost_q:
        "category:disease^5,category:phenotype^5,category:genotype^-10,category:variant^-35",
      prefix: "-OMIA",
      min_match: "67%",
      rows: 10,
      start,
    };

    // make query
    const response = await request<Response>(
      `${biolink}/search/entity/${search}`,
      params
    );
    const {
      numFound: count = 0,
      docs = [],
      facet_counts = {},
      highlighting = {},
    } = response;

    // convert into desired result format
    const results = docs
      .map((doc) => ({
        id: doc.id || "",
        altIds: doc.equivalent_curie || [],
        name: (doc.label || [])[0] || "",
        altNames: (doc.label || []).slice(1),
        category: mapCategory(doc.category || []),
        description: (doc.definition || [])[0] || "",
        score: doc.score || 0,
        prefix: doc.prefix || "",
        highlight: highlighting[doc.id].highlight,
      }))
      .filter(({ category }) => category);

    // empty error status
    if (!results.length) throw new ApiError("No results", "warning");

    // get facets for filters
    const facets: Result["facets"] = {};
    for (const [name, facet] of Object.entries(facet_counts)) {
      facets[name] = [];
      for (const [value, count] of Object.entries(facet)) {
        facets[name].push({ value, count });
      }
    }

    // rename "taxon_label" facet to "taxon" because that's what endpoint expects
    if (facets.taxon_label) {
      facets.taxon = facets.taxon_label;
      delete facets.taxon_label;
    }

    return { count, results, facets };
  } catch (error) {
    throw cleanError(error);
  }
};

export interface Result {
  count: number;
  results: Array<{
    id: string;
    altIds?: Array<string>;
    name?: string;
    altNames?: Array<string>;
    category?: string;
    description?: string;
    score?: number;
    prefix?: string;
    highlight?: string;
  }>;
  facets: Record<
    string,
    Array<{
      value: number | string;
      icon?: string;
      label?: string;
      count?: number | string;
    }>
  >;
}
