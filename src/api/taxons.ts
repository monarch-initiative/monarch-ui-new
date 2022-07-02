import { values } from "lodash";
import { biolink, request } from "./index";

type Response = Record<string, Array<string>>;

/** from list of taxon labels, get list of matching taxon ids */
export const getIdsFromLabels = async (ids: Array<string>): Promise<Result> => {
  try {
    const url = `${biolink}/ontol/identifier/`;
    const params = {
      label: ids,
    };
    const options = { method: "POST" };
    const response = await request<Response>(url, params, options);
    return (
      values(response)
        .map(
          /** list of ids that match this label */
          (ids) =>
            /** prefer ncbi id */
            ids.find((id) => id.includes("NCBITaxon")) ||
            /** fallback to first id */
            ids[0]
        )
        /** filter out no match */
        .filter((id) => id)
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

type Result = Array<string>;
