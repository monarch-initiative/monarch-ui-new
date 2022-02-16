import { biolink, request, cleanError, ApiError } from ".";
import { sleep } from "@/util/debug";

interface Response {
  docs: Array<Doc>;
  highlighting: Record<string, Highlight>;
}
interface Doc {
  id: string;
  category?: Array<string>;
  equivalent_curie?: Array<string>;
  definition?: Array<string>;
  label?: Array<string>;
  score?: number;
  prefix?: string;
}
interface Highlight {
  highlight?: string;
}

// get results from node search text and filters
export const getNodeSearchResults = async (search = ""): Promise<Result> => {
  try {
    if (!search.trim()) throw new ApiError("Nothing searched", "warning");

    // make query
    const response = await request<Response>(
      `${biolink}/search/entity/${search}`
    );

    const { docs = [], highlighting = {} } = response;

    await sleep(5000);

    // convert into desired result format
    const results = docs.map((doc) => ({
      id: doc.id || "",
      altIds: doc.equivalent_curie || [],
      name: (doc.label || [])[0] || "",
      altNames: (doc.label || []).slice(1),
      category: (doc.category || [])[0] || "",
      description: (doc.definition || [])[0] || "",
      score: doc.score || 0,
      prefix: doc.prefix || "",
      highlight: highlighting[doc.id].highlight,
    }));

    if (!results.length) throw new ApiError("No results", "warning");

    return results;
  } catch (error) {
    throw cleanError(error);
  }
};

export type Result = Array<{
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
