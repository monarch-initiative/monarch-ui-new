import { biolink, request, cleanError } from ".";

interface Response {
  id: string;
  label: string;
  iri: string;
  category: Array<string>;
  description: string;
  types: Array<string>;
  synonyms: [
    {
      val: string;
      pred: string;
      xrefs: Array<string>;
    }
  ];
  deprecated: true;
  replaced_by: Array<string>;
  consider: Array<string>;
  taxon: {
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
      category: response.category[0],
      description: response.description,
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
}
