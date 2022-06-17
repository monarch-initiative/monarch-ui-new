import { request, cleanError } from ".";
import { Status } from "@/components/AppStatus";

/** uptimerobot api endpoint */
const uptimeRobot = "https://api.uptimerobot.com/v2/getMonitors";
/** read-only api key, safe to be distributed */
const key = "ur1488940-1c05ba09e0aef926989d6593";
/** uptimerobot.org page for statuses */
const page = "https://stats.uptimerobot.com/XPRo9s4BJ5";

interface Response {
  monitors?: Array<{
    id?: string;
    friendly_name?: string;
    status?: Code;
  }>;
}

/** possible status codes https://uptimerobot.com/api/ */
enum Code {
  paused = 0,
  unchecked = 1,
  up = 2,
  seems_down = 8,
  down = 9,
}

/** get list of uptimerobot monitors and their statuses, names, and other info */
export const getUptimes = async (): Promise<Result> => {
  try {
    /** get data from endpoint */
    const params = { api_key: key };
    const options = { method: "POST" };
    const response = await request<Response>(uptimeRobot, params, options);
    const { monitors = [] } = response;

    /** map uptimerobot status codes to our simplified status codes in status component */
    const codeMap = {
      [Code.paused]: "paused",
      [Code.unchecked]: "unknown",
      [Code.up]: "success",
      [Code.seems_down]: "error",
      [Code.down]: "error",
    };

    /** convert results to desired format */
    const results = monitors.map(
      (monitor): Status => ({
        code: (typeof monitor.status !== "undefined"
          ? codeMap[monitor.status]
          : "unknown") as Status["code"],
        text: monitor.friendly_name,
        link: page + "/" + (monitor.id || ""),
      })
    );

    return results;
  } catch (error) {
    throw cleanError(error);
  }
};

type Result = Array<Status>;
