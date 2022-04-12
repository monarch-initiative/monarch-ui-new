import { mapCategory } from "./categories";
import { uniq, flatMap, uniqBy } from "lodash";
import { getXrefLink } from "./xrefs";
import { biolink, request, cleanError } from ".";

interface Response {
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
    evidence_types?: Array<{
      id: string;
      label: string;
    }>;
    provided_by?: Array<string>;
    publications?: Array<{
      id: string;
      label: string;
    }>;
  }>;
}

// get supporting evidence for a certain association
export const getEvidence = async (id: string): Promise<Result> => {
  try {
    // make query
    const url = `${biolink}/evidence/graph/${id}/table`;
    const { associations } = await request<Response>(url);

    // get combined unique summary info
    const codes = uniqBy(flatMap(associations, "evidence_types"), "id");
    const publications = uniqBy(flatMap(associations, "publications"), "id");
    const sources = uniq(flatMap(associations, "provided_by"));

    // convert into desired result format
    const summary = {
      codes:
        codes?.map((type) => ({
          name: type.label,
          link: getXrefLink(type.id),
        })) || [],
      publications:
        publications?.map((publication) => ({
          name: publication.label || publication.id || "",
          link: getXrefLink(publication.id),
        })) || [],
      sources: sources || [],
    };

    // convert into desired result format
    const table: Table = associations.map((association) => ({
      // see result interface below...
      object: {
        id: association.object.id,
        name: association.object.label,
        iri: association.object.iri,
        category: mapCategory(association.object.category || []),
      },

      // ...
      subject: {
        id: association.subject.id,
        name: association.subject.label,
        iri: association.subject.iri,
        category: mapCategory(association.subject.category || []),
      },

      // ...
      relation: {
        id: association.relation.id,
        name: association.relation.label,
        iri: association.relation.iri,
        category: (association.relation?.category || [])[0] || "",
        inverse: association.relation.inverse,
      },
    }));

    return { summary, table };
  } catch (error) {
    throw cleanError(error);
  }
};

// summary/overview of evidence
interface Summary {
  codes: Array<{
    name: string;
    link: string;
  }>;
  publications: Array<{
    name: string;
    link: string;
  }>;
  sources: Array<string>;
}

// detailed data of evidence
type Table = Array<{
  // subject of association, i.e. current node
  subject: {
    id: string;
    name: string;
    iri: string;
    category: string;
  };

  // object of association, i.e. what current node has association with
  object: {
    id: string;
    name: string;
    iri: string;
    category: string;
  };

  // info about the association
  relation: {
    id: string;
    name: string;
    iri: string;
    category: string;
    inverse: boolean;
  };
}>;

export interface Result {
  summary: Summary;
  table: Table;
}
