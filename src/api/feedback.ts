import { request, cleanError } from ".";

/** serverless endpoint */
const api =
  "https://us-central1-monarch-initiative.cloudfunctions.net/monarch-gh-issue-post";

interface SuccessResponse {
  html_url: string;
}
interface ErrorResponse {
  error: string;
  next_request: string;
}
type Response = SuccessResponse | ErrorResponse;

/** create issue on helpdesk on submit of feedback form */
export const postFeedback = async (title = "", body = ""): Promise<Result> => {
  try {
    /** check params */
    if (!title || !body) throw new Error("Title or body not specified");

    /** post to api endpoint which posts new github issue */
    const data = await request<Response>(
      api,
      { title, body },
      { method: "POST" }
    );

    /** if error */
    if ("error" in data) throw new Error(data.error);

    /** if success */
    if ("html_url" in data) return data.html_url;

    /** last resort */
    throw new Error("Unknown problem submitting feedback");
  } catch (error) {
    throw cleanError(error);
  }
};

type Result = string;
