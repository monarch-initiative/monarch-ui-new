import { handleError } from "./index";
import axios from "axios";
import { Status } from "@/types/status";

// uptimerobot api endpoint
const api = "https://api.uptimerobot.com/v2/getMonitors";
// read-only api key, safe to be distributed
const key = "ur1488940-1c05ba09e0aef926989d6593";
// uptimerobot.org page for statuses
const page = "https://stats.uptimerobot.com/XPRo9s4BJ5";

// expected schemas to be returned from uptimerobot
interface Response {
  monitors?: Array<Monitor>;
}
interface Monitor {
  id?: string;
  friendly_name?: string;
  status?: Code;
}
// possible status codes returned from api https://uptimerobot.com/api/
enum Code {
  paused = 0,
  unchecked = 1,
  up = 2,
  seems_down = 8,
  down = 9,
}

// get list of uptimerobot monitors and their statuses, names, and other info
export const getStatuses = async (): Promise<Array<Status>> => {
  try {
    // get data from endpoint
    const params = { api_key: key };
    const { data } = await axios.post(api, null, { params });
    const { monitors = [] } = data as Response;

    // map uptimerobot status codes to our simplified status codes in status component
    const codeMap = {
      [Code.paused]: "paused",
      [Code.unchecked]: "unknown",
      [Code.up]: "success",
      [Code.seems_down]: "error",
      [Code.down]: "error",
    };

    // convert results to desired format
    const results = monitors.map(
      (monitor: Monitor): Status => ({
        code: (typeof monitor.status !== "undefined"
          ? codeMap[monitor.status]
          : "unknown") as Status["code"],
        text: monitor.friendly_name,
        link: page + "/" + (monitor.id || ""),
      })
    );

    return results;
  } catch (error) {
    handleError(error);
  }

  // default return
  return [];
};
