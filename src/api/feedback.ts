import axios from "axios";
import { handleError } from "./index";

// serverless endpoint
const api =
  "https://us-central1-monarch-initiative.cloudfunctions.net/monarch-gh-issue-post";

// expected schema to be returned from github on success
interface SuccessResponse {
  html_url: string;
}
// expected schema to be returned from endpoint on error
interface ErrorResponse {
  error: string;
  next_request: string;
}

// create issue on helpdesk on submit of feedback form
export const postFeedback = async (title = "", body = ""): Promise<string> => {
  try {
    // check params
    if (!title || !body) throw new Error("Title or body not specified");

    // post to api endpoint which posts new github issue
    const { data } = await axios.post(api, { title, body });

    // if error
    const error = (data as ErrorResponse).error;
    if (error) throw new Error(error);

    // if success
    const link = (data as SuccessResponse).html_url;
    if (link) return link;

    // last resort
    throw new Error("Unknown problem submitting feedback");
  } catch (error) {
    handleError(error);
  }
  return "";
};
