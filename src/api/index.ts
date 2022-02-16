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
    paramsObject.set(String(key), String(value));
  paramsObject.sort();
  const paramsString = "?" + paramsObject.toString();

  // assemble url to query
  const url = path + paramsString;

  // make query
  const response = await window.fetch(url, options);
  if (!response.ok)
    throw new ApiError(`Response not OK - ${response.statusText}`);
  const json = await response.json();

  return json;
};

// takes generic error and turns it into consistent api error
export const cleanError = (error: unknown): ApiError => {
  // log error to console like normal for advanced debugging
  // (log as info instead of error to distinguish between uncaught errors)
  console.info(error);

  // if manually created error, pass through
  if (error instanceof ApiError) return error;
  // otherwise, get user-readable error message
  else return new ApiError("Error: " + (error as Error).message);
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
