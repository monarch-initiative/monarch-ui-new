import { biolink, request, cleanError } from ".";

interface Response {
  id: string;
  label: string;
  iri: string;
  category?: Array<string>;
  description: string | null;
  types: Array<string>;
  inheritance?: Array<{
    id: string;
    label: string;
    iri: string;
  }>;
  synonyms?: [
    {
      val: string;
      pred: string;
      xrefs: Array<string>;
    }
  ];
  clinical_modifiers?: Array<{ label: string }>;
  deprecated: true;
  replaced_by: Array<string>;
  consider: Array<string>;
  taxon?: {
    id: string;
    label: string;
  };
  association_counts: Record<string, unknown>;
  xrefs: Array<string>;
}

// lookup metadata for a node id
export const lookupNode = async (id = "", category = ""): Promise<Result> => {
  try {
    // make query
    const url = `${biolink}/bioentity/${category ? category + "/" : ""}${id}`;
    const response = await request<Response>(url);

    // convert into desired result format
    const metadata = {
      id: response.id,
      name: response.label,
      category: (response.category || [])[0],
      description: response.description || "",
      synonyms: (response.synonyms || []).map(({ val }) => val),
      iri: response.iri,
      inheritance: (response.inheritance || []).map(({ id, label, iri }) => ({
        id,
        name: label,
        link: iri,
      })),
      modifiers: (response.clinical_modifiers || []).map(({ label }) => label),
      taxon: {
        id: response.taxon?.id,
        name: response.taxon?.label,
        link: response.taxon?.id?.startsWith("NCBITaxon:")
          ? `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=info&id=${response.taxon?.id.replace(
              "NCBITaxon:",
              ""
            )}`
          : "",
      },
    };

    return metadata;
  } catch (error) {
    throw cleanError(error);
  }
};

export interface Result {
  id: string;
  name: string;
  category: string;
  description: string;
  synonyms: Array<string>;
  iri: string;
  inheritance: Array<{
    id: string;
    name: string;
    link: string;
  }>;
  modifiers: Array<string>;
  taxon: {
    id?: string;
    name?: string;
    link?: string;
  };
}
