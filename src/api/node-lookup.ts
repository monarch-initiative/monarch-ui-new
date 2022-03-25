import { mapCategory } from "./categories";
import { biolink, request, cleanError } from ".";
import { getXrefLink } from "./xrefs";
import { getGene, Result as GeneResult } from "./node-gene";
import { getPublication } from "./node-publication";
import { getHierarchy, Result as HierarchyResult } from "./node-hierachy";

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
    const metadata: Result = {
      // see result interface below...
      id: response.id,
      originalId: id,
      name: response.label,
      category: mapCategory(response.category),

      // ...
      synonyms: (response.synonyms || []).map(({ val }) => val),
      description: response.description || "",

      // ...
      iri: response.iri,
      inheritance: (response.inheritance || []).map(({ id, label, iri }) => ({
        id,
        name: label,
        link: iri,
      })),
      modifiers: (response.clinical_modifiers || []).map(({ label }) => label),
      xrefs: response.xrefs.map((id) => ({ id, link: getXrefLink(id) })),

      // ...
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

      // ...
      hierarchy: await getHierarchy(id, category),
    };

    // supplement gene with metadata from mygene
    if (category === "gene" || category === "variant") {
      const gene = await getGene(id);
      metadata.description = gene.description;
      metadata.symbol = gene.symbol;
      metadata.genome = gene.genome;
    }

    // supplement publication with metadata from entrez
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

// structure mirrors sections on node page
export interface Result {
  // title section
  id: string;
  originalId: string;
  name: string;
  category: string;

  // overview section
  synonyms: Array<string>;
  description: string;

  // details section
  iri: string;
  inheritance: Array<{
    id: string;
    name: string;
    link: string;
  }>;
  modifiers: Array<string>;
  xrefs: Array<{
    id: string;
    link: string;
  }>;

  // details section (gene specific)
  taxon?: {
    id?: string;
    name?: string;
    link?: string;
  };
  symbol?: string;
  genome?: GeneResult["genome"];

  // details section (publication specific)
  authors?: Array<string>;
  date?: Date;
  doi?: string;
  journal?: string;

  // hierarchy section
  hierarchy: HierarchyResult;
}
