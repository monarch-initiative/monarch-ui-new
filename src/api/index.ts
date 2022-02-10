import axios from "axios";
import { Api, HttpClient } from "./types/types";

export const biolink = new Api(
  new HttpClient({ baseUrl: "https://api.monarchinitiative.org/api" })
);

// generic method for handling api call errors
export const handleError = (error: unknown): unknown => {
  // if axios error, make message more useful
  if (axios.isAxiosError(error)) {
    // log details
    console.error(error.toJSON());

    // description of error
    const data = error?.response?.data as string;
    // generic message and status code
    const message = error?.message;

    // kick back error
    throw new Error(data || message);
  } else {
    // log details and throw error like normal
    console.error(error);
    throw error;
  }
};
