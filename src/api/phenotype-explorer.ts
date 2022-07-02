import { biolink, request, cleanError, ApiError } from ".";
import { getSearchResults } from "./node-search";
import { Options, OptionsFunc } from "@/components/AppSelectTags.d";

/** search individual phenotypes or gene/disease phenotypes */
export const getPhenotypes = async (search = ""): ReturnType<OptionsFunc> => {
  try {
    /**
     * detect pasted list of phenotype ids. deliberately don't detect single id.
     * handle that with regular search.
     */
    const ids = search.split(/\s*,\s*/);
    if (ids.length >= 2)
      return {
        autoAccept: true,
        options: ids.map((id) => ({ id })),
        message: ids.every((id) => id.startsWith("HP:"))
          ? ""
          : 'One or more pasted ids were not valid HPO phenotype ids (start with "HP:")',
      };

    /** otherwise perform string search for phenotypes/genes/diseases */
    const { results } = await getSearchResults(
      search,
      {},
      { category: ["phenotype", "gene", "disease"] }
    );

    /** convert into desired result format */
    return results.map((result) => ({
      id: result.id,
      name: result.name,
      getOptions:
        /** if gene/disease, provide function to get associated phenotypes upon select */
        result.category === "phenotype" || !result.category
          ? undefined
          : async () =>
              await getPhenotypeAssociations(result.id, result.category),
      highlight: result.highlight,
      icon: "category-" + result.category,
      info: result.id,
    }));
  } catch (error) {
    throw cleanError(error);
  }
};

/** phenotype associations with gene/disease (from backend) */
interface _PhenotypeAssociations {
  associations: Array<{
    object: {
      id: string;
      label: string;
    };
  }>;
}

/** get phenotypes associated with gene/disease */
const getPhenotypeAssociations = async (
  id = "",
  category = ""
): Promise<Options> => {
  try {
    /** short circuit if no id or valid category */
    if (!id || !category || !(category === "gene" || category === "disease"))
      throw new ApiError(`Invalid gene/disease id or category`);

    /** endpoint settings */
    const params = {
      direct: true,
      unselect_evidence: true,
    };

    /** make query */
    const url = `${biolink}/bioentity/${category}/${id}/phenotypes`;
    const { associations } = await request<_PhenotypeAssociations>(url, params);

    /** convert into desired result format */
    return associations.map(({ object }) => ({
      id: object.id,
      name: object.label,
    }));
  } catch (error) {
    throw cleanError(error);
  }
};

/** results of phenotype comparison (from backend) */
interface _Comparison {
  matches: Array<{
    id: string;
    label: string;
    type: string;
    taxon?: {
      id?: string;
      label?: string;
    };
    rank: string;
    score: number;
    significance: string;
  }>;
}

/** compare a set of phenotypes to another set of phenotypes */
export const compareSetToSet = async (
  aPhenotypes: Array<string>,
  bPhenotypes: Array<string>
): Promise<Comparison> => {
  try {
    /** make request options */
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const body = {
      reference_ids: aPhenotypes,
      query_ids: [bPhenotypes],
      is_feature_set: aPhenotypes.every((id) => id.startsWith("HP:")),
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    };

    /** make query */
    const url = `${biolink}/sim/compare`;
    const response = await request<_Comparison>(url, {}, options);

    return mapMatches(response);
  } catch (error) {
    throw cleanError(error);
  }
};

/** compare a set of phenotypes to a gene or disease taxon id */
export const compareSetToTaxon = async (
  phenotypes: Array<string>,
  taxon: string
): Promise<Comparison> => {
  /** endpoint settings */
  const params = {
    id: phenotypes,
    taxon: taxon,
  };

  /** make query */
  const url = `${biolink}/sim/search`;
  const response = await request<_Comparison>(url, params);

  return mapMatches(response);
};

/** convert into desired result format */
const mapMatches = (response: _Comparison) => {
  const matches = response.matches.map((match) => ({
    id: match.id,
    name: match.label,
    score: match.score,
    category: match.type || "phenotype",
    taxon: match.taxon?.label || "",
  }));
  const minScore = Math.min(...matches.map(({ score }) => score));
  const maxScore = Math.max(...matches.map(({ score }) => score));

  return { matches, minScore, maxScore };
};

/** results of phenotype comparison (for frontend) */
export interface Comparison {
  matches: Array<{
    id: string;
    name: string;
    score: number;
    category: string;
    taxon: string;
  }>;
  minScore?: number;
  maxScore?: number;
}
