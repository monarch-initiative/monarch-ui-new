import { omitBy } from "lodash";
import { sleep } from "@/util/debug";
import { biolink, request, cleanError, ApiError } from ".";
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
  params = {}
): Promise<Result> => {
  try {
    if (!search.trim()) throw new ApiError("Nothing searched", "warning");

    // make query
    const response = await request<Response>(
      `${biolink}/search/entity/${search}`,
      omitBy(params, (value: string) => !value.trim())
    );
    const { docs = [], facet_counts = {}, highlighting = {} } = response;

    await sleep(1000);

    // convert into desired result format
    const results = docs.map((doc) => ({
      id: doc.id || "",
      altIds: doc.equivalent_curie || [],
      name: (doc.label || [])[0] || "",
      altNames: (doc.label || []).slice(1),
      category: mapCategory(doc.category || []),
      description: (doc.definition || [])[0] || "",
      score: doc.score || 0,
      prefix: doc.prefix || "",
      highlight: highlighting[doc.id].highlight,
    }));

    if (!results.length) throw new ApiError("No results", "warning");

    const facets: Result["facets"] = {};
    for (const [name, facet] of Object.entries(facet_counts))
      facets[name] = Object.entries(facet).map(([value, count]) => ({
        value,
        count,
      }));

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
