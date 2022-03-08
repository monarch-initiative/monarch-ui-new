import { ApiError } from ".";
// https://api-gcp.monarchinitiative.org/api/bioentity/gene/HGNC:30579/phenotypes?direct=true&unselect_evidence=true
import { biolink, request, cleanError } from ".";
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

    // endpoint params
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
