import { sortBy } from "lodash";
import { categories, mapCategory } from "./categories";
import { biolink, request, cleanError } from ".";
import { getXrefLink } from "./xrefs";
import { getGene, Gene } from "./node-gene";
import { getPublication } from "./node-publication";
import { getHierarchy, Hierarchy } from "./node-hierachy";

/** node lookup info (from backend) */
interface _Node {
  id: string;
  label: string;
  iri: string;
  category?: Array<string> | null;
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
  association_counts: Record<
    string,
    {
      counts?: number;
      counts_by_taxon?: number;
    }
  >;
  xrefs: Array<string>;
}

/** lookup metadata for a node id */
export const lookupNode = async (id = "", category = ""): Promise<Node> => {
  try {
    /** set flags */
    const params = {
      fetch_objects: false,
      unselect_evidence: true,
      exclude_automatic_assertions: true,
      use_compact_associations: false,
      get_association_counts:
        true /** missing in biolink docs, but essential */,
      rows: 1,
    };

    /** make query */
    const url = `${biolink}/bioentity/${category ? category + "/" : ""}${id}`;
    const response = await request<_Node>(url, params);

    /** convert into desired result format */
    const metadata: Node = {
      id: response.id,
      originalId: id,
      name: response.label,
      category: mapCategory(response.category || []),

      synonyms: (response.synonyms || []).map(({ val }) => val),
      description: response.description || "",

      iri: response.iri,
      inheritance: (response.inheritance || []).map(({ id, label, iri }) => ({
        id,
        name: label,
        link: iri,
      })),
      modifiers: (response.clinical_modifiers || []).map(({ label }) => label),
      xrefs: response.xrefs.map((id) => ({ id, link: getXrefLink(id) })),

      taxon: {
        id: response.taxon?.id || "",
        name: response.taxon?.label || "",
        link: response.taxon?.id?.startsWith("NCBITaxon:")
          ? `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=info&id=${response.taxon?.id.replace(
              "NCBITaxon:",
              ""
            )}`
          : "",
      },

      hierarchy: await getHierarchy(id, category),

      associationCounts: sortBy(
        Object.entries(response.association_counts || {})
          /** don't include other facets */
          .filter(([, data]) => data.counts !== undefined)
          /** only include categories supported by app */
          .filter(([category]) => categories.includes(category))
          .map(([category, data]) => ({
            id: category || "",
            count: data.counts || 0,
            countByTaxon: data.counts_by_taxon,
          })),
        /** sort by specific order, and put unmatched at end */
        (category) => categories.indexOf(category.id) + 1 || Infinity
      ),
    };

    /** supplement gene with metadata from mygene */
    if (category === "gene" || category === "variant") {
      const gene = await getGene(id);
      metadata.description = gene.description;
      metadata.symbol = gene.symbol;
      metadata.genome = gene.genome;
    }

    /** supplement publication with metadata from entrez */
    if (category === "publication") {
      const publication = await getPublication(id);
      metadata.name = publication.title;
      metadata.description = publication.abstract;
      metadata.authors = publication.authors;
      metadata.date = publication.date;
      metadata.doi = publication.doi;
      metadata.journal = publication.journal;
    }

    return metadata;
  } catch (error) {
    throw cleanError(error);
  }
};

/** node (for frontend). structure/order mirrors sections on node page. */
export interface Node {
  /** title section */
  id: string;
  /** title section */
  originalId: string;
  /** title section */
  name: string;
  /** title section */
  category: string;

  /** overview section */
  synonyms: Array<string>;
  /** overview section */
  description: string;

  /** details section */
  iri: string;
  /** details section */
  inheritance: Array<{
    id: string;
    name: string;
    link: string;
  }>;
  /** details section */
  modifiers: Array<string>;
  /** details section */
  xrefs: Array<{
    id: string;
    link: string;
  }>;

  /** details section (gene specific) */
  taxon?: {
    id?: string;
    name?: string;
    link?: string;
  };
  /** details section (gene specific) */
  symbol?: string;
  /** details section (gene specific) */
  genome?: Gene["genome"];

  /** details section (publication specific) */
  authors?: Array<string>;
  /** details section (publication specific) */
  date?: Date;
  /** details section (publication specific) */
  doi?: string;
  /** details section (publication specific) */
  journal?: string;

  /** hierarchy section */
  hierarchy: Hierarchy;

  /** associations section */
  associationCounts: Array<{
    id: string;
    count: number;
    countByTaxon?: number;
  }>;
}
