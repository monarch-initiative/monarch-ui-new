import axios from "axios";

// generic method for handling api call errors
export const handleError = (error: unknown): unknown => {
  // if axios error, make message more useful
  if (axios.isAxiosError(error)) {
    // description of error
    const data = error?.response?.data as string;
    // generic message and status code
    const message = error?.message;

    // log details
    console.error(message);
    console.error(data);

    // kick back error
    throw new Error(data);
  } else {
    // log details and throw error like normal
    console.error(error);
    throw error;
  }
};
