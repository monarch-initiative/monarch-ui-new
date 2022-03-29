import { startCase } from "lodash";
import { biolink, request, cleanError } from ".";
import { mapCategory, getAssociationEndpoint } from "./categories";

interface Response {
  numFound: number;
  associations: Array<{
    id: string;
    type?: string;
    subject: {
      id: string;
      label: string;
      iri: string;
      category?: Array<string> | null;
      taxon: {
        id: null;
        label: null;
      };
    };
    object: {
      id: string;
      label: string;
      iri: string;
      category?: Array<string> | null;
      taxon?: {
        id: null;
        label: null;
      };
    };
    relation: {
      id: string;
      label: string;
      iri: string;
      category?: Array<string> | null;
      inverse: boolean;
    };
    evidence_graph: {
      nodes: Array<{
        id: string;
        label: string;
      }>;
      edges: Array<{
        sub: string;
        pred: string;
        obj: string;
        meta: Record<string, unknown>;
      }>;
    };
    evidence_types: Array<{
      id: string;
      label: string;
    }>;
    provided_by: Array<string>;
    frequency: {
      id?: string;
      label?: string;
    };
    onset: {
      id?: string;
      label?: string;
    };
    publications: Array<{
      id: string;
      label: string;
    }>;
  }>;

  facet_counts: Record<string, unknown>;
}

// get associations between a node and a category
export const getAssociations = async (
  nodeId = "",
  nodeCategory = "",
  assocationCategory = "",
  rows = 10,
  start = 0,
  search = ""
): Promise<Result> => {
  try {
    // get causal/correlated param
    let type = "both";
    if (assocationCategory.startsWith("causal-")) type = "causal";
    if (assocationCategory.startsWith("correlated-")) type = "non_causal";

    // make query params
    const params = {
      rows,
      start,
      association_type: type,
      ...(search ? { q: search } : {}),
    };

    // make query
    const url = `${biolink}/bioentity/${nodeCategory}/${nodeId}/${getAssociationEndpoint(
      assocationCategory
    )}`;
    const response = await request<Response>(url, params);

    // convert into desired result format
    const associations = response.associations.map((association) => ({
      id: association.id,
      object: {
        id: association.object.id,
        name: association.object.label,
        iri: association.object.iri,
        category: mapCategory(association.object.category || []),
        taxon: {
          id: association.object.taxon?.id || "",
          name: association.object.taxon?.label || "",
        },
      },
      subject: {
        id: association.subject.id,
        name: association.subject.label,
        iri: association.subject.iri,
        category: mapCategory(association.subject.category || []),
        taxon: {
          id: association.subject.taxon?.id || "",
          name: association.subject.taxon?.label || "",
        },
      },
      relation: {
        id: association.relation.id,
        name: startCase(association.relation.label),
        iri: association.relation.iri,
        category: (association.relation?.category || [])[0] || "",
        inverse: association.relation.inverse,
      },
      evidence: [],
    }));

    return { count: response.numFound || 0, associations };
  } catch (error) {
    throw cleanError(error);
  }
};

export interface Result {
  count: number;
  associations: Array<{
    id: string;
    subject: {
      id: string;
      name: string;
      iri: string;
      category: string;
      taxon: {
        id: string;
        name: string;
      };
    };
    object: {
      id: string;
      name: string;
      iri: string;
      category: string;
      taxon: {
        id: string;
        name: string;
      };
    };
    relation: {
      id: string;
      name: string;
      iri: string;
      category: string;
      inverse: boolean;
    };
    evidence: Array<Record<string, unknown>>;
  }>;
}

// get top few associations
export const getTopAssociations = async (
  nodeId = "",
  nodeCategory = "",
  assocationCategory = ""
): Promise<Result["associations"]> =>
  (await getAssociations(nodeId, nodeCategory, assocationCategory, 5))
    .associations;
