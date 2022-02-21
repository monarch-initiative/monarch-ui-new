import { Codes } from "@/components/AppStatus";

// base biolink url
export const biolink = "https://api.monarchinitiative.org/api";

// generic fetch request wrapper
export const request = async <T = unknown>(
  path = "",
  params = {},
  options = {}
): Promise<T> => {
  // get string of url parameters/options
  const paramsObject = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    for (const part of String(value).split(",")) paramsObject.append(key, part);

  paramsObject.sort();
  const paramsString = "?" + paramsObject.toString();

  // assemble url to query
  const url = path + paramsString;

  // make request
  console.info("Making request", url.replaceAll(" ", "%20"));
  const response = await fetch(url, options);
  if (!response.ok)
    throw new ApiError(`Response not OK - ${response.statusText}`);
  const json = await response.json();

  return json;
};

// takes generic error and turns it into consistent api error
export const cleanError = (error: unknown): ApiError => {
  // if not manually created error
  if (!(error instanceof ApiError))
    // turn it into one with user-readable error message
    error = new ApiError("Error: " + (error as Error).message);

  // log error to console like normal for advanced debugging
  // (log as info instead of error to distinguish between uncaught errors)
  console.groupCollapsed((error as ApiError).text);
  console.info(error);
  console.groupEnd();

  return error as ApiError;
};

// custom error type to throw with extra details to easily integrate into status
export class ApiError extends Error {
  code: typeof Codes[number];
  text: string;
  constructor(text = "", code: typeof Codes[number] = "error") {
    super();
    this.name = "ApiError";
    this.text = String(text);
    this.code = code;
  }
}
