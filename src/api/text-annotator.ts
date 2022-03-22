import { biolink, ApiError, request, cleanError } from "./index";

interface Response {
  content: string;
  spans: Array<{
    start: number;
    end: number;
    text: string;
    token: Array<{
      id: string;
      category: Array<string>;
      terms: Array<string>;
    }>;
  }>;
}

// get annotations from full text
export const annotateText = async (content = ""): Promise<Result> => {
  try {
    // if nothing searched, return empty
    if (!content.trim()) throw new ApiError("No results", "warning");

    // request params
    const params = {
      longest_only: true,
    };

    // make request options
    const headers = new Headers();
    headers.append(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=UTF-8"
    );
    const body = "content=" + window.encodeURIComponent(content);
    const options = { method: "POST", headers, body };

    // make query
    const url = `${biolink}/nlp/annotate/entities`;
    const response = await request<Response>(url, params, options);
    const { spans } = response;

    // empty error status
    if (!spans.length) throw new ApiError("No results", "warning");

    // get ordered, de-duped list of string indices, including start and end
    const indices: Array<[number, number]> = [
      0,
      ...new Set(spans.map(({ start, end }) => [start, end]).flat()),
      content.length - 1,
    ]
      .sort((a, b) => a - b)
      .map((index, i, array) => [index, array[i + 1] || index]);

    // convert into desired result format
    const annotations: Result = [];
    for (const [start, end] of indices) {
      annotations.push({
        text: content.slice(start, end),
        tokens: spans
          .filter((span) => span.start === start && span.end === end)
          .map(({ token }) => token[0])
          .filter((token) => token)
          .map((token) => ({
            id: token.id,
            category: token.category[0],
            terms: token.terms.join(", "),
          })),
      });
    }

    return annotations;
  } catch (error) {
    throw cleanError(error);
  }
};

export type Result = Array<{
  text: string;
  tokens: Array<{
    id: string;
    category: string;
    terms: string;
  }>;
}>;
