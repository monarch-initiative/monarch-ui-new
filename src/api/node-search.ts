import { biolink, request, cleanError, ApiError } from ".";
import { Filters, Query, facetsToFilters, queryToParams } from "./facets";

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
export const getSearchResults = async (
  search = "",
  availableFilters: Query = {},
  activeFilters: Query = {},
  start = 0
): Promise<Result> => {
  try {
    // if nothing searched, return empty
    if (!search.trim()) throw new ApiError("No results", "warning");

    // other params
    const params = {
      ...queryToParams(availableFilters, activeFilters),
      boost_q: [
        "category:disease^5",
        "category:phenotype^5",
        "category:gene^0",
        "category:genotype^-10",
        "category:variant^-35",
      ],
      prefix: "-OMIA",
      min_match: "67%",
      rows: 10,
      start,
    };

    // make query
    const url = `${biolink}/search/entity/${search}`;
    const response = await request<Response>(url, params);
    const {
      numFound: count = 0,
      docs = [],
      facet_counts = {},
      highlighting = {},
    } = response;

    // convert into desired result format
    const results = docs.map((doc) => ({
      id: doc.id || "",
      name: (doc.label || [])[0] || "",
      altIds: doc.equivalent_curie || [],
      altNames: (doc.label || []).slice(1),
      category: (doc.category || [])[0] || "unknown",
      description: (doc.definition || [])[0] || "",
      score: doc.score || 0,
      prefix: doc.prefix || "",
      highlight: highlighting[doc.id].highlight,
    }));

    // empty error status
    if (!results.length) throw new ApiError("No results", "warning");

    // get facets for select options
    const facets = facetsToFilters(facet_counts);

    return { count, results, facets };
  } catch (error) {
    throw cleanError(error);
  }
};

export interface Result {
  count: number;
  results: Array<{
    id: string;
    name?: string;
    altIds?: Array<string>;
    altNames?: Array<string>;
    category?: string;
    description?: string;
    score?: number;
    prefix?: string;
    highlight?: string;
  }>;
  facets: Filters;
}
