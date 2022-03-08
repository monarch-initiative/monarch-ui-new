import { biolink, request, cleanError, ApiError } from ".";
import { getNodeSearchResults } from "./node-search";
import { Options, OptionsFunc } from "@/components/AppSelectTags.d";

// search individual phenotypes or gene/disease phenotypes
export const getPhenotypes = async (search = ""): ReturnType<OptionsFunc> => {
  try {
    // detect pasted list of phenotype ids
    const ids = search.split(/\s*,\s*/);
    if (ids.length >= 2)
      return { autoAccept: true, options: ids.map((id) => ({ value: id })) };

    // otherwise perform string search for phenotypes/genes/diseases
    const { results } = await getNodeSearchResults(
      search,
      {},
      { category: ["phenotype", "gene", "disease"] }
    );

    // convert into desired result format
    return results.map((result) => ({
      value: result.id,
      valueFunc:
        // if gene/disease, provide function to get associated phenotypes upon select
        result.category === "phenotype" || !result.category
          ? undefined
          : async () =>
              await getPhenotypeAssociations(result.id, result.category),
      highlight: result.highlight,
      label: result.label,
      icon: "category-" + (result.category || "unknown"),
      info: result.id,
    }));
  } catch (error) {
    throw cleanError(error);
  }
};

// get phenotypes associated with gene or disease
const getPhenotypeAssociations = async (
  id = "",
  category = ""
): Promise<Options> => {
  interface Response {
    associations: Array<{
      object: {
        id: string;
        label: string;
      };
    }>;
  }

  try {
    // short circuit if no id or valid category
    if (!id || !category || !(category === "gene" || category === "disease"))
      throw new ApiError(`Invalid gene/disease id or category`);

    // endpoint settings
    const params = {
      direct: true,
      unselect_evidence: true,
    };

    // make query
    const url = `${biolink}/bioentity/${category}/${id}/phenotypes`;
    const { associations } = await request<Response>(url, params);

    // convert into desired result format
    return associations.map(({ object }) => ({
      value: object.id,
      label: object.label,
    }));
  } catch (error) {
    throw cleanError(error);
  }
};

// compare a set of phenotypes to another set of phenotypes
export const compareSetToSet = async (
  aPhenotypes: Array<string>,
  bPhenotypes: Array<string>
): Promise<void> => {
  try {
    // use POST version of endpoint because GET is bugged:
    // https://github.com/biolink/biolink-api/issues/389

    // make request options
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const body = {
      reference_ids: aPhenotypes,
      query_ids: bPhenotypes.map((id) => [id]),
      is_feature_set: aPhenotypes.every((id) => id.startsWith("HP:")),
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    };

    // make query
    const url = `${biolink}/sim/compare`;
    const response = await request(url, {}, options);
    console.log(response);
  } catch (error) {
    throw cleanError(error);
  }
};

// compare a set of phenotypes to a gene or disease
export const compareSetToGene = async (
  phenotypes: Array<string>,
  taxon: string
): Promise<void> => {
  // endpoint settings
  const params = {
    id: phenotypes.join(","),
    taxon: taxonIdMap[taxon] || "",
  };

  // make query
  const url = `${biolink}/sim/search`;
  const response = await request(url, params);

  console.log(response);
};

const taxonIdMap: Record<string, string> = {
  human: "9606",
  mouse: "10090",
  zebrafish: "7955",
  fruitfly: "7227",
  worm: "6239",
  frog: "8353",
};

// HP:0000322, HP:0001166, HP:0001238
