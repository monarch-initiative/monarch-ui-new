import { Codes } from "@/components/AppStatus";

// base biolink url
export const biolink = "https://api.monarchinitiative.org/api";

// generic fetch request wrapper
export const request = async <T = unknown>(
  // request url
  path = "",
  // url params. comma-separated values expand to repeated keys.
  params = {},
  // fetch options
  options = {}
): Promise<T> => {
  // get string of url parameters/options
  const paramsObject = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    for (const part of String(value).split(",")) paramsObject.append(key, part);

  // sort params for consistency
  paramsObject.sort();

  // assemble url to query
  const paramsString = "?" + paramsObject.toString();
  const url = path + paramsString;

  // make request
  console.info("Making request", url.replaceAll(" ", "%20"));
  const response = await fetch(url, options);
  if (!response.ok) throw new ApiError(`Response not OK`);
  const json = await response.json();

  return json;
};

// takes generic error and turns it into consistent api error
export const cleanError = (error: unknown): ApiError => {
  // if not manually created error
  if (!(error instanceof ApiError))
    // turn it into one with user-readable error message
    error = new ApiError("Error: " + (error as Error).message);

  // if this error hasn't already been logged
  if (!(error as ApiError).logged) {
    // log error to console like normal for advanced debugging and stack trace
    // but wrap in group to distinguish between unhandled errors
    console.groupCollapsed((error as ApiError).text);
    console.error(error);
    console.groupEnd();
    (error as ApiError).logged = true;
  }

  return error as ApiError;
};

// custom error type to throw with extra details to easily integrate into status
export class ApiError extends Error {
  code: typeof Codes[number];
  text: string;
  // flag to track if error already logged
  // prevents duplicate logs when kicking errors up multiple try/catch levels
  logged: boolean;
  constructor(text = "", code: typeof Codes[number] = "error") {
    super();
    this.name = "ApiError";
    this.text = String(text);
    this.code = code;
    this.logged = false;
  }
}
