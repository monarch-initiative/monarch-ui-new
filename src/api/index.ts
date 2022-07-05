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
  /** start cache if not already started */
  if (!cache) await initCache();

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
  const url = window
    .decodeURIComponent(path + paramsString)
    .replaceAll(" ", "%20");
  const endpoint = path.replace(biolink, "");

  /** make request object */
  const request = new Request(url, options);

  /** first check if request is cached */
  let response = await cache.match(request);

  if (response) {
    console.groupCollapsed("Using cached request", endpoint);
    console.info(url);
    console.info(request);
    console.groupEnd();
  }

  /** if request not cached */
  if (!response) {
    console.groupCollapsed("Making new request", endpoint);
    console.info(url);
    console.info(request);
    console.groupEnd();

    /** make new request */
    response = await fetch(request);

    /** check response code */
    if (!response.ok) throw new Error(`Response not OK`);

    /**
     * add response to cache (if not GET,
     * https://w3c.github.io/ServiceWorker/#cache-put step 4)
     */
    if (request.method === "GET") await cache.put(request, response.clone());
  }

  /** parse response */
  const parsed =
    parse === "text"
      ? ((await response.text()) as unknown as T)
      : await response.json();

  console.groupCollapsed("Response", endpoint);
  console.info(parsed);
  console.info(response);
  console.groupEnd();

  return parsed;
};

/** cache interface */
let cache: Cache;
const name = "monarch-cache";

/** start cache */
const initCache = async () => {
  /** start fresh each session (as if using sessionStorage) */
  await window.caches.delete(name);
  /** set cache interface */
  cache = await window.caches.open(name);
};
