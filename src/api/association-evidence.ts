import { mapCategory } from "./categories";
import { uniq, flatMap, uniqBy } from "lodash";
import { getXrefLink } from "./xrefs";
import { biolink, request, cleanError } from ".";

interface EvidenceType {
  id: string;
  label?: string;
}

interface Publication {
  id: string;
  label?: string;
}

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
    evidence_types?: Array<EvidenceType>;
    provided_by?: Array<string>;
    publications?: Array<Publication>;
    object_eq?: Array<string>;
    subject_eq?: Array<string>;
  }>;
}

/** get supporting evidence for a certain association */
export const getEvidence = async (id: string): Promise<Result> => {
  try {
    /** make query */
    const url = `${biolink}/evidence/graph/${id}/table`;
    const { associations } = await request<Response>(url);

    /** get combined unique summary info */
    const codes = uniqBy(flatMap(associations, "evidence_types"), "id");
    const publications = uniqBy(flatMap(associations, "publications"), "id");
    const sources = uniq(flatMap(associations, "provided_by"));

    /** convert evidence code into desired format */
    const mapCode = (code: EvidenceType) => ({
      name: code.label || "",
      link: getXrefLink(code.id),
    });

    /** convert publication into desired format */
    const mapPublication = (publication: Publication) => ({
      name: publication.label || publication.id || "",
      link: getXrefLink(publication.id),
    });

    /** convert "provided by" into desired format */
    const mapSource = (source = "") => ({
      name: source.split("/").pop() || source,
      link: source,
    });

    /** convert reference into desired format */
    const mapReference = (reference = "") => ({
      name: reference,
      link: getXrefLink(reference),
    });

    /** convert summary data into desired result format */
    const summary = {
      codes: codes?.map(mapCode) || [],
      publications: publications?.map(mapPublication) || [],
      sources: sources || [],
    };

    /** convert table data into desired result format */
    const table: Table = associations.map(
      (association) =>
        ({
          object: {
            id: association.object.id,
            name: association.object.label,
            iri: association.object.iri,
            category: mapCategory(association.object.category || []),
          },

          subject: {
            id: association.subject.id,
            name: association.subject.label,
            iri: association.subject.iri,
            category: mapCategory(association.subject.category || []),
          },

          relation: {
            id: association.relation.id,
            name: association.relation.label,
            iri: association.relation.iri,
            category: (association.relation?.category || [])[0] || "",
            inverse: association.relation.inverse,
          },

          codes: association.evidence_types?.map(mapCode) || [],

          publications: association.publications?.map(mapPublication) || [],

          sources: association.provided_by?.map(mapSource) || [],

          references: [
            ...(association.object_eq || []),
            ...(association.subject_eq || []),
          ].map(mapReference),
        } as Evidence)
    );

    return { summary, table };
  } catch (error) {
    throw cleanError(error);
  }
};

/** summary/overview of evidence */
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

/** detailed data of evidence */
type Table = Array<Evidence>;

interface Evidence {
  /** subject of association */
  subject: {
    id: string;
    name: string;
    iri: string;
    category: string;
  };

  /** object of association */
  object: {
    id: string;
    name: string;
    iri: string;
    category: string;
  };

  /** info about the association */
  relation: {
    id: string;
    name: string;
    iri: string;
    category: string;
    inverse: boolean;
  };

  /** evidence codes (add explanation of meaning) */
  codes: Array<{
    name: string;
    link: string;
  }>;

  /** publications (add explanation of meaning) */
  publications: Array<{
    name: string;
    link: string;
  }>;

  /** sources (add explanation of meaning) */
  sources: Array<{
    name: string;
    link: string;
  }>;

  /** references (add explanation of meaning) */
  references: Array<{
    name: string;
    link: string;
  }>;
}

export interface Result {
  summary: Summary;
  table: Table;
}
