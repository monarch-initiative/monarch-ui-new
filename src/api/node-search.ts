import { biolink, request, cleanError, ApiError } from ".";
import { Options } from "./../components/AppSelectMulti.d";
import { mapCategory } from "./categories";

interface Response {
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
  activeFilters: Record<string, Options> = {}
): Promise<Result> => {
  try {
    if (!search.trim()) throw new ApiError("Nothing searched", "warning");

    // get facet params
    let params: Record<string, string> = {};
    for (const [key, value] of Object.entries(activeFilters)) {
      // transform filters into comma-separated lists for request
      const string = (value || [])
        .map(({ value }) => value)
        .filter((value) => String(value).trim())
        .sort()
        .join(",");

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
    };

    // make query
    const response = await request<Response>(
      `${biolink}/search/entity/${search}`,
      params
    );
    const { docs = [], facet_counts = {}, highlighting = {} } = response;

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

    if (!results.length) throw new ApiError("No results", "warning");

    // get facets for filters
    const facets: Result["facets"] = {};
    for (const [name, facet] of Object.entries(facet_counts)) {
      facets[name] = [];
      for (const [value, count] of Object.entries(facet)) {
        facets[name].push({ value, count });
      }
    }

    return { results, facets };
  } catch (error) {
    throw cleanError(error);
  }
};

export interface Result {
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
