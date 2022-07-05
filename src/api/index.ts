/** base biolink url */
export const biolink = "https://api.monarchinitiative.org/api";

/**
 * key/value object for request query parameters. use primitive for single, e.g.
 * evidence=true. use array for multiple/duplicate, e.g. id=abc&id=def&id=ghi
 */
type Param = string | number | boolean | undefined | null;
export type Params = Record<string, Param | Array<Param>>;

/**
 * generic fetch request wrapper
 *
 * @param path request url
 * @param params url params
 * @param options fetch() options
 * @param parse parse response mode
 */
export const request = async <T>(
  path = "",
  params: Params = {},
  options: RequestInit = {},
  parse: "text" | "json" = "json"
): Promise<T> => {
  /** get string of url parameters/options */
  const paramsObject = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const values = [value].flat();
    for (const value of values)
      if (["string", "number", "boolean"].includes(typeof value))
        paramsObject.append(key, String(value));
  }

  /** sort params for consistency */
  paramsObject.sort();

  /** assemble url to query */
  const paramsString = "?" + paramsObject.toString();
  const url = path + paramsString;

  /** make request */
  console.info(
    "Making request",
    window.decodeURIComponent(url).replaceAll(" ", "%20")
  );
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Response not OK`);

  /** parse response */
  if (parse === "text") return (await response.text()) as unknown as T;
  else return await response.json();
};
