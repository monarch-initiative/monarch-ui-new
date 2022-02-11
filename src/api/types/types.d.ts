/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export declare type BioObject = NamedObject & {
  taxon?: Taxon;
  association_counts?: object;
  xrefs?: string[];
};
export declare type NamedObject = NamedObjectCore & {
  description?: string;
  types?: string[];
  synonyms?: SynonymPropertyValue[];
  deprecated?: boolean;
  replaced_by?: string[];
  consider?: string[];
};
export interface NamedObjectCore {
  /** ID or CURIE e.g. MGI:1201606 */
  id: string;
  /** RDFS Label */
  label?: string;
  /** IRI */
  iri?: string;
  category?: string[];
}
export declare type SynonymPropertyValue = AbstractPropertyValue & object;
export interface AbstractPropertyValue {
  /** value part */
  val?: string;
  /** predicate (attribute) part */
  pred?: string;
  /** Xrefs provenance for property-value */
  xrefs?: string[];
}
export interface Taxon {
  /** CURIE ID, e.g. NCBITaxon:9606 */
  id?: string;
  /** RDFS Label */
  label?: string;
}
export declare type AssociationResults = SearchResult & {
  associations?: Association[];
  compact_associations?: CompactAssociationSet[];
  objects?: string[];
};
export interface SearchResult {
  /** total number of associations matching query */
  numFound?: number;
  /** solr docs */
  docs?: object[];
  /** Mapping between field names and association counts */
  facet_counts?: object;
  /** Mapping between id and solr highlight */
  highlighting?: object;
}
export interface Association {
  /** Association/annotation unique ID */
  id: string;
  /** Type of association, e.g. gene-phenotype */
  type?: string;
  /** Subject of association (what it is about), e.g. ClinVar:nnn, MGI:1201606 */
  subject: BioObjectCore;
  /** Equivalent identifiers to subject node */
  subject_eq?: string[];
  subject_extensions?: AnnotationExtension[];
  /** Object (sensu RDF), aka target, e.g. HP:0000448, MP:0002109, DOID:14330 */
  object: BioObjectCore;
  /** Equivalent identifiers to object node */
  object_eq?: string[];
  object_extensions?: AnnotationExtension[];
  /** Relationship type connecting subject and object */
  relation: RelationRef;
  /** Objects mapped to a slim */
  slim?: string[];
  /** True if association is negated */
  negated?: boolean;
  /** Qualifier on the association */
  qualifiers?: string[];
  /** An indirect association is a join between two or more direct assocations, e.g. gene to disease via ortholog. We record the full set of associations as a graph object */
  evidence_graph?: Graph;
  /** Evidence types (ECO classes) */
  evidence_types?: EntityReference[];
  /** Provider of association, e.g. Orphanet, ClinVar */
  provided_by?: string[];
  /** Publications supporting association, extracted from evidence graph */
  publications?: EntityReference[];
}
export declare type BioObjectCore = NamedObjectCore & {
  taxon?: Taxon;
};
export interface AnnotationExtension {
  /** Relationship type. If more than one value, interpreted as chain */
  relation_chain?: Relation[];
  /** Extension interpreted as OWL expression (r1 some r2 some .. some filler). */
  filler?: NamedObject;
}
export declare type Relation = NamedObject & object;
export declare type RelationRef = NamedObjectCore & {
  inverse?: boolean;
};
export interface Graph {
  /** All nodes in graph */
  nodes?: Node[];
  /** All edges in graph */
  edges?: Edge[];
}
export interface Node {
  /** ID or CURIE e.g. MGI:1201606 */
  id: string;
  /** RDFS Label */
  label?: string;
}
export interface Edge {
  /** Subject (source) Node ID */
  sub?: string;
  /** Predicate (relation) ID */
  pred?: string;
  /** Object (target) Node ID */
  obj?: string;
  /** metadata about the Edge */
  meta?: object;
}
export interface EntityReference {
  /** ID or CURIE e.g. MGI:1201606 */
  id?: string;
  /** RDFS Label */
  label?: string;
}
export interface CompactAssociationSet {
  /** Subject of association (what it is about), e.g. MGI:1201606 */
  subject: string;
  /** Relationship type connecting subject and object list */
  relation: string;
  /** List of O, for a given (S,R) pair, yielding (S,R,O) triples. E.g. list of MPs for (MGI:nnn, has_phenotype) */
  objects: string[];
}
export declare type D2PAssociationResults = SearchResult & {
  associations?: D2PAssociation[];
  compact_associations?: CompactAssociationSet[];
  objects?: string[];
};
export declare type D2PAssociation = Association & {
  frequency?: EntityReference;
  onset?: EntityReference;
};
export declare type SequenceFeature = BioObject & {
  locations?: SequenceLocation[];
  seq?: Seq;
  homology_associations?: Association[];
};
export declare type SequenceLocation = BioObject & {
  start?: SequencePosition;
  end?: SequencePosition;
  phase?: number;
  score?: number;
  strand?: number;
};
export interface SequencePosition {
  position?: number;
  reference?: string;
}
export declare type Seq = BioObject & {
  alphabet?: string;
  residues?: string;
  md5checksum?: string;
  seqlen?: string;
};
export interface EntityAnnotationResult {
  content?: string;
  /** A marked-up span of text */
  spans?: Span[];
}
export interface Span {
  /** start of span text relative to content */
  start?: number;
  /** end of span text relative to content */
  end?: number;
  /** span text */
  text?: string;
  /** A token or entity extracted from the span text */
  token?: Token[];
}
export interface Token {
  /** The CURIE for the entity or token */
  id?: string;
  /** entity categories */
  category?: string[];
  /** terms */
  terms?: string[];
}
export interface LayResults {
  /** list of AutocompleteResult docs */
  results?: LayAutocomplete[];
}
export interface LayAutocomplete {
  /** curie formatted id */
  id?: string;
  /** primary label (rdfs:label) */
  label?: string;
  /** matched synonym */
  matched_synonym?: string;
  /** solr highlight */
  highlight?: string;
}
export interface AutocompleteResults {
  /** list of AutocompleteResult docs */
  docs?: AutocompleteResult[];
}
export interface AutocompleteResult {
  /** curie formatted id */
  id?: string;
  /** primary label (rdfs:label) */
  label?: string[];
  /** matched part of document (may be primary label, synonym, id, etc) */
  match?: string;
  /** node categories */
  category?: string[];
  /** taxon as NCBITaxon curie */
  taxon?: string;
  /** taxon label */
  taxon_label?: string;
  /** solr highlight */
  highlight?: string;
  /** True if highlight can be interpreted as html, else False */
  has_highlight?: boolean;
  /** Equivalent IDs */
  equivalent_ids?: string[];
}
export interface SufficiencyPostInput {
  /** curie formatted id */
  id?: string;
  /** list of features */
  features?: Feature[];
}
export interface Feature {
  /** curie formatted id */
  id?: string;
  /** curie formatted id */
  label?: string;
  /** feature type (only phenotype supported) */
  type?: string;
  /** is the feature present */
  isPresent?: boolean;
}
export interface SufficiencyOutput {
  /** simple score */
  simple_score?: number;
  /** scaled score */
  scaled_score?: number;
  /** categorical score */
  categorical_score?: number;
}
export interface SimResult {
  query?: SimQuery;
  matches?: SimMatch[];
  metadata?: SimMetadata;
}
export interface SimQuery {
  ids?: Node[];
  negated_ids?: Node[];
  /** list of unresolved ids */
  unresolved_ids?: string[];
  target_ids?: Node[][];
  /** reference individual or class (eg gene, disease) */
  reference?: TypedNode;
}
export declare type TypedNode = Node & {
  type?: string;
  taxon?: Node;
};
export declare type SimMatch = TypedNode & {
  rank?: string;
  score?: number;
  significance?: string;
  pairwise_match?: PairwiseMatch[];
};
export interface PairwiseMatch {
  /** reference id */
  reference?: IcNode;
  /** match id */
  match?: IcNode;
  /** lowest common subsumer */
  lcs?: IcNode;
}
export declare type IcNode = Node & {
  IC?: number;
};
export interface SimMetadata {
  /** max IC */
  max_max_ic?: number;
}
export interface CompareInput {
  /** list of ids */
  reference_ids?: string[];
  /** list of query profiles */
  query_ids?: string[][];
}
export declare type Mme = object;
export interface VariantSet {
  /** The unique identifier of a variant set */
  id?: number;
  /** Article title */
  title: string;
  /** Article content */
  body: string;
  /** @format date-time */
  pub_date?: string;
  category_id?: number;
  category?: string;
}
export declare type PageOfVariantSets = APageOfResults & {
  items?: VariantSet[];
};
export interface APageOfResults {
  /** Number of this page of results */
  page?: number;
  /** Total number of pages of results */
  pages?: number;
  /** Number of items per page of results */
  per_page?: number;
  /** Total number of results */
  total?: number;
}
export declare namespace Association {
  /**
   * @description Given two entities (e.g. a particular gene and a particular disease), if these two entities are connected (directly or indirectly), then return the association objects describing the connection.
   * @tags association
   * @name GetAssociationsBetween
   * @summary Returns associations connecting two entities
   * @request GET:/association/between/{subject}/{object}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetAssociationsBetween {
    type RequestParams = {
      object: string;
      subject: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      evidence?: string;
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      use_compact_associations?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags association
   * @name GetAssociationBySubjectCategorySearch
   * @summary Returns list of matching associations for a given subject category
   * @request GET:/association/find/{subject_category}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetAssociationBySubjectCategorySearch {
    type RequestParams = {
      subjectCategory: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      evidence?: string;
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      use_compact_associations?: boolean;
      subject_taxon?: string;
      object_taxon?: string;
      relation?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags association
   * @name GetAssociationBySubjectAndObjectCategorySearch
   * @summary Returns list of matching associations between a given subject and object category
   * @request GET:/association/find/{subject_category}/{object_category}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetAssociationBySubjectAndObjectCategorySearch {
    type RequestParams = {
      objectCategory: string;
      subjectCategory: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      evidence?: string;
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      use_compact_associations?: boolean;
      subject?: string;
      object?: string;
      subject_taxon?: string;
      object_taxon?: string;
      relation?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags association
   * @name GetAssociationsFrom
   * @summary Returns list of matching associations starting from a given subject (source)
   * @request GET:/association/from/{subject}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetAssociationsFrom {
    type RequestParams = {
      subject: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      evidence?: string;
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      use_compact_associations?: boolean;
      object_taxon?: string;
      relation?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags association
   * @name GetAssociationsTo
   * @summary Returns list of matching associations pointing to a given object (target)
   * @request GET:/association/to/{object}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetAssociationsTo {
    type RequestParams = {
      object: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      evidence?: string;
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      use_compact_associations?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags association
   * @name GetAssociationBySubjectAndAssocType
   * @summary Returns list of matching associations of a given type
   * @request GET:/association/type/{association_type}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetAssociationBySubjectAndAssocType {
    type RequestParams = {
      associationType: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      evidence?: string;
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      use_compact_associations?: boolean;
      subject?: string;
      object?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * @description An association connects, at a minimum, two things, designated subject and object, via some relationship. Associations also include evidence, provenance etc.
   * @tags association
   * @name GetAssociationObject
   * @summary Returns the association with a given identifier
   * @request GET:/association/{id}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetAssociationObject {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
}
export declare namespace Bioentity {
  /**
   * No description
   * @tags bioentity
   * @name GetAnatomyGeneAssociations
   * @summary Returns genes associated with a given anatomy
   * @request GET:/bioentity/anatomy/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetAnatomyGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description For example, + NCBITaxon:10090 (mouse)
   * @tags bioentity
   * @name GetAnatomyGeneByTaxonAssociations
   * @summary Returns gene IDs for all genes associated with a given anatomy, filtered by taxon
   * @request GET:/bioentity/anatomy/{id}/genes/{taxid}
   * @deprecated
   * @response `200` `void` Success
   */
  namespace GetAnatomyGeneByTaxonAssociations {
    type RequestParams = {
      taxid: string;
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetCaseDiseaseAssociations
   * @summary Returns diseases associated with a case
   * @request GET:/bioentity/case/{id}/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetCaseDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetCaseGenotypeAssociations
   * @summary Returns genotypes associated with a case
   * @request GET:/bioentity/case/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetCaseGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetCaseModelAssociations
   * @summary Returns models associated with a case
   * @request GET:/bioentity/case/{id}/models
   * @response `200` `AssociationResults` Success
   */
  namespace GetCaseModelAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetCasePhenotypeAssociations
   * @summary Returns phenotypes associated with a case
   * @request GET:/bioentity/case/{id}/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetCasePhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetCaseVariantAssociations
   * @summary Returns variants associated with a case
   * @request GET:/bioentity/case/{id}/variants
   * @response `200` `AssociationResults` Success
   */
  namespace GetCaseVariantAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetDiseaseCaseAssociations
   * @summary Returns cases associated with a disease
   * @request GET:/bioentity/disease/{id}/cases
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseaseCaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetDiseaseGeneAssociations
   * @summary Returns genes associated with a disease
   * @request GET:/bioentity/disease/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseaseGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
      association_type?: "causal" | "non_causal" | "both";
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetDiseaseGenotypeAssociations
   * @summary Returns genotypes associated with a disease
   * @request GET:/bioentity/disease/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseaseGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description In the association object returned, the subject will be the disease, and the object will be the model. The model may be a gene or genetic element. If the query disease is a general class, the association subject may be to a specific disease. In some cases the association will be *direct*, for example if a paper asserts a genotype is a model of a disease. In other cases, the association will be *indirect*, for example, chaining over orthology. In these cases the chain will be reflected in the *evidence graph* * TODO: provide hook into owlsim for dynamic computation of models by similarity
   * @tags bioentity
   * @name GetDiseaseModelAssociations
   * @summary Returns associations to models of the disease
   * @request GET:/bioentity/disease/{id}/models
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseaseModelAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description See /disease/<id>/models route for full details
   * @tags bioentity
   * @name GetDiseaseModelTaxonAssociations
   * @summary Returns associations to models of the disease constrained by taxon
   * @request GET:/bioentity/disease/{id}/models/{taxon}
   * @deprecated
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseaseModelTaxonAssociations {
    type RequestParams = {
      taxon: string;
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetDiseasePathwayAssociations
   * @summary Returns pathways associated with a disease
   * @request GET:/bioentity/disease/{id}/pathways
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseasePathwayAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetDiseasePhenotypeAssociations
   * @summary Returns phenotypes associated with disease
   * @request GET:/bioentity/disease/{id}/phenotypes
   * @response `200` `D2PAssociationResults` Success
   */
  namespace GetDiseasePhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = D2PAssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetDiseasePublicationAssociations
   * @summary Returns publications associated with a disease
   * @request GET:/bioentity/disease/{id}/publications
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseasePublicationAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description e.g. drugs or small molecules used to treat
   * @tags bioentity
   * @name GetDiseaseSubstanceAssociations
   * @summary Returns substances associated with a disease
   * @request GET:/bioentity/disease/{id}/treatment
   * @response `200` `void` Success
   */
  namespace GetDiseaseSubstanceAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetDiseaseVariantAssociations
   * @summary Returns variants associated with a disease
   * @request GET:/bioentity/disease/{id}/variants
   * @response `200` `AssociationResults` Success
   */
  namespace GetDiseaseVariantAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetFunctionAssociations
   * @summary Returns annotations associated to a function term
   * @request GET:/bioentity/function/{id}
   * @response `200` `void` Success
   */
  namespace GetFunctionAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      start?: number;
      rows?: number;
      evidence?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetFunctionGeneAssociations
   * @summary Returns genes associated to a GO term
   * @request GET:/bioentity/function/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetFunctionGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
      relationship_type?: "involved_in" | "involved_in_regulation_of" | "acts_upstream_of_or_within";
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetFunctionPublicationAssociations
   * @summary Returns publications associated to a GO term
   * @request GET:/bioentity/function/{id}/publications
   * @response `200` `void` Success
   */
  namespace GetFunctionPublicationAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      start?: number;
      rows?: number;
      evidence?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetFunctionTaxonAssociations
   * @summary Returns taxons associated to a GO term
   * @request GET:/bioentity/function/{id}/taxons
   * @response `200` `void` Success
   */
  namespace GetFunctionTaxonAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      start?: number;
      rows?: number;
      evidence?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneAnatomyAssociations
   * @summary Returns anatomical entities associated with a gene
   * @request GET:/bioentity/gene/{id}/anatomy
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneAnatomyAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneCaseAssociations
   * @summary Returns cases associated with a gene
   * @request GET:/bioentity/gene/{id}/cases
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneCaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneDiseaseAssociations
   * @summary Returns diseases associated with gene
   * @request GET:/bioentity/gene/{id}/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
      association_type?: "causal" | "non_causal" | "both";
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneExpressionAssociations
   * @summary Returns expression events for a gene
   * @request GET:/bioentity/gene/{id}/expression/anatomy
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneExpressionAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description IMPLEMENTATION DETAILS ---------------------- Note: currently this is implemented as a query to the GO/AmiGO solr instance. This directly supports IDs such as: - ZFIN e.g. ZFIN:ZDB-GENE-050417-357 Note that the AmiGO GOlr natively stores MGI annotations to MGI:MGI:nn. However, the standard for biolink is MGI:nnnn, so you should use this (will be transparently mapped to legacy ID) Additionally, for some species such as Human, GO has the annotation attached to the UniProt ID. Again, this should be transparently handled; e.g. you can use NCBIGene:6469, and this will be mapped behind the scenes for querying.
   * @tags bioentity
   * @name GetGeneFunctionAssociations
   * @summary Returns function associations for a gene
   * @request GET:/bioentity/gene/{id}/function
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneFunctionAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneGenotypeAssociations
   * @summary Returns genotypes associated with a gene
   * @request GET:/bioentity/gene/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneHomologAssociations
   * @summary Returns homologs for a gene
   * @request GET:/bioentity/gene/{id}/homologs
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneHomologAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      homology_type?: "P" | "O" | "LDO";
      direct_taxon?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneInteractions
   * @summary Returns interactions for a gene
   * @request GET:/bioentity/gene/{id}/interactions
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneInteractions {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneModelAssociations
   * @summary Returns models associated with a gene
   * @request GET:/bioentity/gene/{id}/models
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneModelAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneOrthologDiseaseAssociations
   * @summary Return diseases associated with orthologs of a gene
   * @request GET:/bioentity/gene/{id}/ortholog/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneOrthologDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneOrthologPhenotypeAssociations
   * @summary Return phenotypes associated with orthologs for a gene
   * @request GET:/bioentity/gene/{id}/ortholog/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneOrthologPhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenePathwayAssociations
   * @summary Returns pathways associated with gene
   * @request GET:/bioentity/gene/{id}/pathways
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenePathwayAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenePhenotypeAssociations
   * @summary Returns phenotypes associated with gene
   * @request GET:/bioentity/gene/{id}/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenePhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenePublicationAssociations
   * @summary Returns publications associated with a gene
   * @request GET:/bioentity/gene/{id}/publications
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenePublicationAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGeneVariantAssociations
   * @summary Returns variants associated with a gene
   * @request GET:/bioentity/gene/{id}/variants
   * @response `200` `AssociationResults` Success
   */
  namespace GetGeneVariantAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenotypeCaseAssociations
   * @summary Returns cases associated with a genotype
   * @request GET:/bioentity/genotype/{id}/cases
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypeCaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenotypeDiseaseAssociations
   * @summary Returns diseases associated with a genotype
   * @request GET:/bioentity/genotype/{id}/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypeDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenotypeGeneAssociations
   * @summary Returns genes associated with a genotype
   * @request GET:/bioentity/genotype/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypeGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description Genotypes may be related to one another according to the GENO model
   * @tags bioentity
   * @name GetGenotypeGenotypeAssociations
   * @summary Returns genotypes-genotype associations
   * @request GET:/bioentity/genotype/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypeGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenotypeModelAssociations
   * @summary Returns models associated with a genotype
   * @request GET:/bioentity/genotype/{id}/models
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypeModelAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenotypePhenotypeAssociations
   * @summary Returns phenotypes associated with a genotype
   * @request GET:/bioentity/genotype/{id}/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypePhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenotypePublicationAssociations
   * @summary Returns publications associated with a genotype
   * @request GET:/bioentity/genotype/{id}/publications
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypePublicationAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenotypeVariantAssociations
   * @summary Returns genotypes-variant associations
   * @request GET:/bioentity/genotype/{id}/variants
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenotypeVariantAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGotermGeneAssociations
   * @summary Returns associations to GO terms for a gene
   * @request GET:/bioentity/goterm/{id}/genes
   * @deprecated
   * @response `200` `AssociationResults` Success
   */
  namespace GetGotermGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      relationship_type?: "involved_in" | "involved_in_regulation_of" | "acts_upstream_of_or_within";
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetModelCaseAssociations
   * @summary Returns cases associated with a model
   * @request GET:/bioentity/model/{id}/cases
   * @response `200` `AssociationResults` Success
   */
  namespace GetModelCaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetModelDiseaseAssociations
   * @summary Returns diseases associated with a model
   * @request GET:/bioentity/model/{id}/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetModelDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetModelGeneAssociations
   * @summary Returns genes associated with a model
   * @request GET:/bioentity/model/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetModelGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetModelGenotypeAssociations
   * @summary Returns genotypes associated with a model
   * @request GET:/bioentity/model/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetModelGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetModelPhenotypeAssociations
   * @summary Returns phenotypes associated with a model
   * @request GET:/bioentity/model/{id}/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetModelPhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetModelPublicationAssociations
   * @summary Returns publications associated with a model
   * @request GET:/bioentity/model/{id}/publications
   * @response `200` `AssociationResults` Success
   */
  namespace GetModelPublicationAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetModelVariantAssociations
   * @summary Returns variants associated with a model
   * @request GET:/bioentity/model/{id}/variants
   * @response `200` `AssociationResults` Success
   */
  namespace GetModelVariantAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPathwayDiseaseAssociations
   * @summary Returns diseases associated with a pathway
   * @request GET:/bioentity/pathway/{id}/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetPathwayDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPathwayGeneAssociations
   * @summary Returns genes associated with a pathway
   * @request GET:/bioentity/pathway/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetPathwayGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPathwayPhenotypeAssociations
   * @summary Returns phenotypes associated with a pathway
   * @request GET:/bioentity/pathway/{id}/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetPathwayPhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description Example IDs: * MP:0008521 abnormal Bowman membrane
   * @tags bioentity
   * @name GetPhenotypeAnatomyAssociations
   * @summary Returns anatomical entities associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/anatomy
   * @response `200` `(NamedObject)[]` Success
   */
  namespace GetPhenotypeAnatomyAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = NamedObject[];
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPhenotypeCaseAssociations
   * @summary Returns cases associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/cases
   * @response `200` `AssociationResults` Success
   */
  namespace GetPhenotypeCaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPhenotypeDiseaseAssociations
   * @summary Returns diseases associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/diseases
   * @response `200` `D2PAssociationResults` Success
   */
  namespace GetPhenotypeDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = D2PAssociationResults;
  }
  /**
   * @description For example, MP:0001569 + NCBITaxon:10090 (mouse)
   * @tags bioentity
   * @name GetPhenotypeGeneByTaxonAssociations
   * @summary Returns gene IDs for all genes associated with a given phenotype, filtered by taxon
   * @request GET:/bioentity/phenotype/{id}/gene/{taxid}/ids
   * @deprecated
   * @response `200` `void` Success
   */
  namespace GetPhenotypeGeneByTaxonAssociations {
    type RequestParams = {
      taxid: string;
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPhenotypeGeneAssociations
   * @summary Returns genes associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetPhenotypeGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPhenotypeGenotypeAssociations
   * @summary Returns genotypes associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetPhenotypeGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPhenotypePathwayAssociations
   * @summary Returns pathways associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/pathways
   * @response `200` `AssociationResults` Success
   */
  namespace GetPhenotypePathwayAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPhenotypePublicationAssociations
   * @summary Returns publications associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/publications
   * @response `200` `AssociationResults` Success
   */
  namespace GetPhenotypePublicationAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPhenotypeVariantAssociations
   * @summary Returns variants associated with a phenotype
   * @request GET:/bioentity/phenotype/{id}/variants
   * @response `200` `AssociationResults` Success
   */
  namespace GetPhenotypeVariantAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPublicationDiseaseAssociations
   * @summary Returns diseases associated with a publication
   * @request GET:/bioentity/publication/{id}/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetPublicationDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPublicationGeneAssociations
   * @summary Returns genes associated with a publication
   * @request GET:/bioentity/publication/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetPublicationGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPublicationGenotypeAssociations
   * @summary Returns genotypes associated with a publication
   * @request GET:/bioentity/publication/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetPublicationGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPublicationModelAssociations
   * @summary Returns models associated with a publication
   * @request GET:/bioentity/publication/{id}/models
   * @response `200` `AssociationResults` Success
   */
  namespace GetPublicationModelAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPublicationPhenotypeAssociations
   * @summary Returns phenotypes associated with a publication
   * @request GET:/bioentity/publication/{id}/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetPublicationPhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetPublicationVariantAssociations
   * @summary Returns variants associated with a publication
   * @request GET:/bioentity/publication/{id}/variants
   * @response `200` `AssociationResults` Success
   */
  namespace GetPublicationVariantAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * @description Examples relationships: * substance is a metabolite of a process * substance is synthesized by a process * substance is modified by an activity * substance elicits a response program/pathway * substance is transported by activity or pathway For example, CHEBI:40036 (amitrole)
   * @tags bioentity
   * @name GetSubstanceParticipantInAssociations
   * @summary Returns associations between an activity and process and the specified substance
   * @request GET:/bioentity/substance/{id}/participant_in
   * @response `200` `(Association)[]` Success
   */
  namespace GetSubstanceParticipantInAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
  /**
   * @description Roles may be human-oriented (e.g. pesticide) or molecular (e.g. enzyme inhibitor)
   * @tags bioentity
   * @name GetSubstanceRoleAssociations
   * @summary Returns associations between given drug and roles
   * @request GET:/bioentity/substance/{id}/roles
   * @response `200` `(Association)[]` Success
   */
  namespace GetSubstanceRoleAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
  /**
   * @description e.g. drugs or small molecules used to treat
   * @tags bioentity
   * @name GetSubstanceTreatsAssociations
   * @summary Returns substances associated with a disease
   * @request GET:/bioentity/substance/{id}/treats
   * @response `200` `void` Success
   */
  namespace GetSubstanceTreatsAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetVariantCaseAssociations
   * @summary Returns cases associated with a variant
   * @request GET:/bioentity/variant/{id}/cases
   * @response `200` `AssociationResults` Success
   */
  namespace GetVariantCaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetVariantDiseaseAssociations
   * @summary Returns diseases associated with a variant
   * @request GET:/bioentity/variant/{id}/diseases
   * @response `200` `AssociationResults` Success
   */
  namespace GetVariantDiseaseAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetVariantGeneAssociations
   * @summary Returns genes associated with a variant
   * @request GET:/bioentity/variant/{id}/genes
   * @response `200` `AssociationResults` Success
   */
  namespace GetVariantGeneAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetVariantGenotypeAssociations
   * @summary Returns genotypes associated with a variant
   * @request GET:/bioentity/variant/{id}/genotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetVariantGenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetVariantModelAssociations
   * @summary Returns models associated with a variant
   * @request GET:/bioentity/variant/{id}/models
   * @response `200` `AssociationResults` Success
   */
  namespace GetVariantModelAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetVariantPhenotypeAssociations
   * @summary Returns phenotypes associated with a variant
   * @request GET:/bioentity/variant/{id}/phenotypes
   * @response `200` `AssociationResults` Success
   */
  namespace GetVariantPhenotypeAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetVariantPublicationAssociations
   * @summary Returns publications associated with a variant
   * @request GET:/bioentity/variant/{id}/publications
   * @response `200` `AssociationResults` Success
   */
  namespace GetVariantPublicationAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenericObject
   * @summary Returns basic info on object of any type
   * @request GET:/bioentity/{id}
   * @response `200` `BioObject` Success
   */
  namespace GetGenericObject {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = BioObject;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenericAssociations
   * @summary Returns associations for an entity regardless of the type
   * @request GET:/bioentity/{id}/associations
   * @response `200` `AssociationResults` Success
   */
  namespace GetGenericAssociations {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      taxon?: string[];
      direct_taxon?: boolean;
      relation?: string;
      sort?: string;
      q?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults;
  }
  /**
   * No description
   * @tags bioentity
   * @name GetGenericObjectByType
   * @summary Return basic info on an object for a given type
   * @request GET:/bioentity/{type}/{id}
   * @response `200` `void` Success
   */
  namespace GetGenericObjectByType {
    type RequestParams = {
      type:
        | "gene"
        | "variant"
        | "genotype"
        | "phenotype"
        | "disease"
        | "goterm"
        | "pathway"
        | "anatomy"
        | "substance"
        | "individual"
        | "publication"
        | "model"
        | "case";
      id: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: number;
      facet?: boolean;
      facet_fields?: string[];
      unselect_evidence?: boolean;
      exclude_automatic_assertions?: boolean;
      fetch_objects?: boolean;
      use_compact_associations?: boolean;
      slim?: string[];
      evidence?: string;
      direct?: boolean;
      get_association_counts?: boolean;
      distinct_counts?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Bioentityset {
  /**
   * No description
   * @tags bioentityset
   * @name GetEntitySetAssociations
   * @summary Returns compact associations for a given input set
   * @request GET:/bioentityset/associations
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetEntitySetAssociations {
    type RequestParams = {};
    type RequestQuery = {
      subject?: string[];
      background?: string[];
      object_category?: string;
      object_slim?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags bioentityset
   * @name GetEntitySetSummary
   * @summary Summary statistics for objects associated
   * @request GET:/bioentityset/descriptor/counts
   * @response `200` `void` Success
   */
  namespace GetEntitySetSummary {
    type RequestParams = {};
    type RequestQuery = {
      subject?: string[];
      background?: string[];
      object_category?: string;
      object_slim?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentityset
   * @name GetEntitySetGraphResource
   * @summary TODO Graph object spanning all entities
   * @request GET:/bioentityset/graph
   * @response `200` `void` Success
   */
  namespace GetEntitySetGraphResource {
    type RequestParams = {};
    type RequestQuery = {
      subject?: string[];
      background?: string[];
      object_category?: string;
      object_slim?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentityset/homologs
   * @name GetEntitySetHomologs
   * @summary Returns homology associations for a given input set of genes
   * @request GET:/bioentityset/homologs/
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetEntitySetHomologs {
    type RequestParams = {};
    type RequestQuery = {
      subject?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags bioentityset
   * @name GetOverRepresentation
   * @summary Summary statistics for objects associated
   * @request GET:/bioentityset/overrepresentation
   * @response `200` `void` Success
   */
  namespace GetOverRepresentation {
    type RequestParams = {};
    type RequestQuery = {
      object_category?: string;
      subject?: string[];
      background?: string[];
      subject_category?: string;
      max_p_value?: string;
      ontology?: string;
      taxon?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentityset/slimmer
   * @name GetEntitySetAnatomySlimmer
   * @summary For a given gene(s), summarize its annotations over a defined set of slim
   * @request GET:/bioentityset/slimmer/anatomy
   * @response `200` `void` Success
   */
  namespace GetEntitySetAnatomySlimmer {
    type RequestParams = {};
    type RequestQuery = {
      subject: string[];
      slim: string[];
      exclude_automatic_assertions?: boolean;
      rows?: number;
      start?: number;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentityset/slimmer
   * @name GetEntitySetFunctionSlimmer
   * @summary For a given gene(s), summarize its annotations over a defined set of slim
   * @request GET:/bioentityset/slimmer/function
   * @response `200` `void` Success
   */
  namespace GetEntitySetFunctionSlimmer {
    type RequestParams = {};
    type RequestQuery = {
      relationship_type?: "involved_in" | "acts_upstream_of_or_within";
      subject: string[];
      slim: string[];
      exclude_automatic_assertions?: boolean;
      rows?: number;
      start?: number;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags bioentityset/slimmer
   * @name GetEntitySetPhenotypeSlimmer
   * @summary For a given gene(s), summarize its annotations over a defined set of slim
   * @request GET:/bioentityset/slimmer/phenotype
   * @response `200` `void` Success
   */
  namespace GetEntitySetPhenotypeSlimmer {
    type RequestParams = {};
    type RequestQuery = {
      subject: string[];
      slim: string[];
      exclude_automatic_assertions?: boolean;
      rows?: number;
      start?: number;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Cam {
  /**
   * No description
   * @tags cam
   * @name GetActivityCollection
   * @summary Returns list of models
   * @request GET:/cam/activity
   * @response `200` `void` Success
   */
  namespace GetActivityCollection {
    type RequestParams = {};
    type RequestQuery = {
      title?: string;
      contributor?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetInstanceObject
   * @summary Returns list of matches
   * @request GET:/cam/instance/{id}
   * @response `200` `(Association)[]` Success
   */
  namespace GetInstanceObject {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      title?: string;
      contributor?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
  /**
   * No description
   * @tags cam
   * @name GetModelInstances
   * @summary Returns list of all instances
   * @request GET:/cam/instances
   * @response `200` `void` Success
   */
  namespace GetModelInstances {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetModelCollection
   * @summary Returns list of ALL models
   * @request GET:/cam/model
   * @response `200` `void` Success
   */
  namespace GetModelCollection {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetModelContributors
   * @summary Returns list of all contributors across all models
   * @request GET:/cam/model/contributors
   * @response `200` `void` Success
   */
  namespace GetModelContributors {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetModelProperties
   * @summary Returns list of all properties used across all models
   * @request GET:/cam/model/properties
   * @response `200` `void` Success
   */
  namespace GetModelProperties {
    type RequestParams = {};
    type RequestQuery = {
      title?: string;
      contributor?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetModelPropertyValues
   * @summary Returns list property-values for all models
   * @request GET:/cam/model/property_values
   * @response `200` `void` Success
   */
  namespace GetModelPropertyValues {
    type RequestParams = {};
    type RequestQuery = {
      title?: string;
      contributor?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetModelQuery
   * @summary Returns list of models matching query
   * @request GET:/cam/model/query
   * @response `200` `void` Success
   */
  namespace GetModelQuery {
    type RequestParams = {};
    type RequestQuery = {
      title?: string;
      contributor?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetModelObject
   * @summary Returns a complete model
   * @request GET:/cam/model/{id}
   * @response `200` `void` Success
   */
  namespace GetModelObject {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags cam
   * @name GetPhysicalInteraction
   * @summary Returns list of models
   * @request GET:/cam/physical_interaction
   * @response `200` `void` Success
   */
  namespace GetPhysicalInteraction {
    type RequestParams = {};
    type RequestQuery = {
      title?: string;
      contributor?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Evidence {
  /**
   * @description Note that every association is assumed to have a unique ID
   * @tags evidence/graph
   * @name GetEvidenceGraphObject
   * @summary Returns evidence graph object for a given association
   * @request GET:/evidence/graph/{id}
   * @response `200` `(Graph)[]` Success
   */
  namespace GetEvidenceGraphObject {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Graph[];
  }
  /**
   * @description Note that every association is assumed to have a unique ID
   * @tags evidence/graph
   * @name GetEvidenceGraphTable
   * @summary Returns evidence as a association_results object given an association
   * @request GET:/evidence/graph/{id}/table
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetEvidenceGraphTable {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      is_publication?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
}
export declare namespace Genome {
  /**
   * No description
   * @tags genome/features
   * @name GetFeaturesWithinResource
   * @summary Returns list of matches
   * @request GET:/genome/features/within/{build}/{reference}/{begin}/{end}
   * @response `200` `(SequenceFeature)[]` Success
   */
  namespace GetFeaturesWithinResource {
    type RequestParams = {
      build: string;
      reference: string;
      begin: string;
      end: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = SequenceFeature[];
  }
}
export declare namespace Graph {
  /**
   * No description
   * @tags graph
   * @name GetEdgeResource
   * @summary Returns edges emanating from a given node
   * @request GET:/graph/edges/from/{id}
   * @response `200` `(Graph)[]` Success
   */
  namespace GetEdgeResource {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      depth?: number;
      direction?: "INCOMING" | "OUTGOING" | "BOTH";
      relationship_type?: string[];
      entail?: boolean;
      graph?: "data" | "ontology";
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Graph[];
  }
  /**
   * @description A node is an abstract representation of some kind of entity. The entity may be a physical thing such as a patient, a molecular entity such as a gene or protein, or a conceptual entity such as a class from an ontology.
   * @tags graph
   * @name GetNodeResource
   * @summary Returns a graph node
   * @request GET:/graph/node/{id}
   * @response `200` `(BioObject)[]` Success
   */
  namespace GetNodeResource {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = BioObject[];
  }
}
export declare namespace Identifier {
  /**
   * No description
   * @tags identifier/mapper
   * @name GetIdentifierMapper
   * @summary TODO maps a list of identifiers from a source to a target
   * @request GET:/identifier/mapper/{source}/{target}/
   * @response `200` `(Association)[]` Success
   */
  namespace GetIdentifierMapper {
    type RequestParams = {
      source: string;
      target: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
  /**
   * No description
   * @tags identifier/prefixes
   * @name GetPrefixCollection
   * @summary Returns list of prefixes
   * @request GET:/identifier/prefixes/
   * @response `200` `void` Success
   */
  namespace GetPrefixCollection {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags identifier/prefixes
   * @name GetPrefixContract
   * @summary Returns contracted URI
   * @request GET:/identifier/prefixes/contract/{uri}
   * @response `200` `void` Success
   */
  namespace GetPrefixContract {
    type RequestParams = {
      uri: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags identifier/prefixes
   * @name GetPrefixExpand
   * @summary Returns expanded URI
   * @request GET:/identifier/prefixes/expand/{id}
   * @response `200` `void` Success
   */
  namespace GetPrefixExpand {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Individual {
  /**
   * No description
   * @tags individual
   * @name GetPedigree
   * @summary Returns list of matches
   * @request GET:/individual/pedigree/{id}
   * @response `200` `(Association)[]` Success
   */
  namespace GetPedigree {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
  /**
   * No description
   * @tags individual
   * @name GetIndividual
   * @summary Returns list of matches
   * @request GET:/individual/{id}
   * @response `200` `(Association)[]` Success
   */
  namespace GetIndividual {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
}
export declare namespace Mart {
  /**
   * @description NOTE: this route has a limiter on it, you may be restricted in the number of downloads per hour. Use carefully.
   * @tags mart
   * @name GetMartCaseAssociationsResource
   * @summary Bulk download of case associations
   * @request GET:/mart/case/{object_category}/{taxon}
   * @response `200` `void` Success
   */
  namespace GetMartCaseAssociationsResource {
    type RequestParams = {
      taxon: string;
      objectCategory: string;
    };
    type RequestQuery = {
      slim?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * @description NOTE: this route has a limiter on it, you may be restricted in the number of downloads per hour. Use carefully.
   * @tags mart
   * @name GetMartDiseaseAssociationsResource
   * @summary Bulk download of disease associations
   * @request GET:/mart/disease/{object_category}/{taxon}
   * @response `200` `void` Success
   */
  namespace GetMartDiseaseAssociationsResource {
    type RequestParams = {
      taxon: string;
      objectCategory: string;
    };
    type RequestQuery = {
      slim?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * @description NOTE: this route has a limiter on it, you may be restricted in the number of downloads per hour. Use carefully.
   * @tags mart
   * @name GetMartGeneAssociationsResource
   * @summary Bulk download of gene associations
   * @request GET:/mart/gene/{object_category}/{taxon}
   * @response `200` `void` Success
   */
  namespace GetMartGeneAssociationsResource {
    type RequestParams = {
      taxon: string;
      objectCategory: string;
    };
    type RequestQuery = {
      slim?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags mart
   * @name GetMartOrthologAssociationsResource
   * @summary Bulk download of orthologs
   * @request GET:/mart/ortholog/{taxon1}/{taxon2}
   * @response `200` `void` Success
   */
  namespace GetMartOrthologAssociationsResource {
    type RequestParams = {
      taxon2: string;
      taxon1: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags mart
   * @name GetMartParalogAssociationsResource
   * @summary Bulk download of paralogs
   * @request GET:/mart/paralog/{taxon1}/{taxon2}
   * @response `200` `void` Success
   */
  namespace GetMartParalogAssociationsResource {
    type RequestParams = {
      taxon2: string;
      taxon1: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Metadata {
  /**
   * No description
   * @tags metadata
   * @name GetMetadataForDatasets
   * @summary Get metadata for all datasets from SciGraph
   * @request GET:/metadata/datasets
   * @response `200` `void` Success
   */
  namespace GetMetadataForDatasets {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Mme {
  /**
   * No description
   * @tags mme
   * @name PostDiseaseMme
   * @summary Match a patient to diseases based on their phenotypes
   * @request POST:/mme/disease
   * @response `200` `void` Success
   */
  namespace PostDiseaseMme {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = Mme;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags mme
   * @name PostFlyMme
   * @summary Match a patient to fruit fly genes based on similar phenotypes
   * @request POST:/mme/fly
   * @response `200` `void` Success
   */
  namespace PostFlyMme {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = Mme;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags mme
   * @name PostMouseMme
   * @summary Match a patient to mouse genes based on similar phenotypes
   * @request POST:/mme/mouse
   * @response `200` `void` Success
   */
  namespace PostMouseMme {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = Mme;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags mme
   * @name PostNematodeMme
   * @summary Match a patient to nematode genes based on similar phenotypes
   * @request POST:/mme/nematode
   * @response `200` `void` Success
   */
  namespace PostNematodeMme {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = Mme;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags mme
   * @name PostZebrafishMme
   * @summary Match a patient to zebrafish genes based on similar phenotypes
   * @request POST:/mme/zebrafish
   * @response `200` `void` Success
   */
  namespace PostZebrafishMme {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = Mme;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Nlp {
  /**
   * No description
   * @tags nlp/annotate
   * @name GetAnnotate
   * @summary Annotate a given text using SciGraph annotator
   * @request GET:/nlp/annotate/
   * @response `200` `void` Success
   */
  namespace GetAnnotate {
    type RequestParams = {};
    type RequestQuery = {
      content?: string;
      include_category?: string[];
      exclude_category?: string[];
      min_length?: string;
      longest_only?: boolean;
      include_abbreviation?: boolean;
      include_acronym?: boolean;
      include_numbers?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags nlp/annotate
   * @name PostAnnotate
   * @summary Annotate a given text using SciGraph annotator
   * @request POST:/nlp/annotate/
   * @response `200` `void` Success
   */
  namespace PostAnnotate {
    type RequestParams = {};
    type RequestQuery = {
      content?: string;
      include_category?: string[];
      exclude_category?: string[];
      min_length?: string;
      longest_only?: boolean;
      include_abbreviation?: boolean;
      include_acronym?: boolean;
      include_numbers?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags nlp/annotate
   * @name GetAnnotateEntities
   * @summary Annotate a given content using SciGraph annotator and get all entities from content
   * @request GET:/nlp/annotate/entities
   * @response `200` `EntityAnnotationResult` Success
   */
  namespace GetAnnotateEntities {
    type RequestParams = {};
    type RequestQuery = {
      content?: string;
      include_category?: string[];
      exclude_category?: string[];
      min_length?: string;
      longest_only?: boolean;
      include_abbreviation?: boolean;
      include_acronym?: boolean;
      include_numbers?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = EntityAnnotationResult;
  }
  /**
   * No description
   * @tags nlp/annotate
   * @name PostAnnotateEntities
   * @summary Annotate a given content using SciGraph annotator and get all entities from content
   * @request POST:/nlp/annotate/entities
   * @response `200` `EntityAnnotationResult` Success
   */
  namespace PostAnnotateEntities {
    type RequestParams = {};
    type RequestQuery = {
      content?: string;
      include_category?: string[];
      exclude_category?: string[];
      min_length?: string;
      longest_only?: boolean;
      include_abbreviation?: boolean;
      include_acronym?: boolean;
      include_numbers?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = EntityAnnotationResult;
  }
}
export declare namespace Ontol {
  /**
   * @description ``` IC = -log2( freq(t) / popSize ) ``` Here the frequency and population is calculated for a particular dataset: e.g. all human disease-phenotype associations
   * @tags ontol
   * @name GetInformationContentResource
   * @summary Returns information content (IC) for a set of relevant ontology classes
   * @request GET:/ontol/information_content/{subject_category}/{object_category}/{subject_taxon}
   * @response `200` `void` Success
   */
  namespace GetInformationContentResource {
    type RequestParams = {
      subjectCategory: string;
      objectCategory: string;
      subjectTaxon: string;
    };
    type RequestQuery = {
      evidence?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontol/labeler
   * @name GetOntolLabelerResource
   * @summary Fetches a map from CURIEs/IDs to labels
   * @request GET:/ontol/labeler/
   * @response `200` `void` Success
   */
  namespace GetOntolLabelerResource {
    type RequestParams = {};
    type RequestQuery = {
      id?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontol
   * @name GetExtractOntologySubgraphResource
   * @summary Extract a subgraph from an ontology
   * @request GET:/ontol/subgraph/{ontology}/{node}
   * @response `200` `void` Success
   */
  namespace GetExtractOntologySubgraphResource {
    type RequestParams = {
      node: string;
      ontology: string;
    };
    type RequestQuery = {
      cnode?: string[];
      include_ancestors?: boolean;
      include_descendants?: boolean;
      relation?: string[];
      include_meta?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontol
   * @name PostExtractOntologySubgraphResource
   * @summary Extract a subgraph from an ontology
   * @request POST:/ontol/subgraph/{ontology}/{node}
   * @response `200` `void` Success
   */
  namespace PostExtractOntologySubgraphResource {
    type RequestParams = {
      node: string;
      ontology: string;
    };
    type RequestQuery = {
      cnode?: string[];
      include_ancestors?: boolean;
      include_descendants?: boolean;
      relation?: string[];
      include_meta?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Ontology {
  /**
   * No description
   * @tags ontology
   * @name GetOntologyTermsSharedAncestor
   * @summary Returns the ancestor ontology terms shared by two ontology terms
   * @request GET:/ontology/shared/{subject}/{object}
   * @response `200` `void` Success
   */
  namespace GetOntologyTermsSharedAncestor {
    type RequestParams = {
      subject: string;
      object: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontology
   * @name GetOntologySubset
   * @summary Returns meta data of an ontology subset (slim)
   * @request GET:/ontology/subset/{id}
   * @response `200` `void` Success
   */
  namespace GetOntologySubset {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontology
   * @name GetOntologyTerm
   * @summary Returns meta data of an ontology term
   * @request GET:/ontology/term/{id}
   * @response `200` `void` Success
   */
  namespace GetOntologyTerm {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontology
   * @name GetOntologyTermGraph
   * @summary Returns graph of an ontology term
   * @request GET:/ontology/term/{id}/graph
   * @response `200` `void` Success
   */
  namespace GetOntologyTermGraph {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      graph_type?:
        | "topology_graph"
        | "regulates_transitivity_graph"
        | "neighborhood_graph"
        | "neighborhood_limited_graph";
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontology
   * @name GetOntologyTermSubgraph
   * @summary Extract a subgraph from an ontology term
   * @request GET:/ontology/term/{id}/subgraph
   * @response `200` `void` Success
   */
  namespace GetOntologyTermSubgraph {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {
      cnode?: string[];
      include_ancestors?: boolean;
      include_descendants?: boolean;
      relation?: string[];
      include_meta?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags ontology
   * @name GetOntologyTermSubsets
   * @summary Returns subsets (slims) associated to an ontology term
   * @request GET:/ontology/term/{id}/subsets
   * @response `200` `void` Success
   */
  namespace GetOntologyTermSubsets {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Owl {
  /**
   * No description
   * @tags owl/ontology
   * @name GetDlQuery
   * @summary Placeholder - use OWLery for now
   * @request GET:/owl/ontology/dlquery/{query}
   * @response `200` `(Association)[]` Success
   */
  namespace GetDlQuery {
    type RequestParams = {
      query: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
  /**
   * No description
   * @tags owl/ontology
   * @name GetSparqlQuery
   * @summary Placeholder - use direct SPARQL endpoint for now
   * @request GET:/owl/ontology/sparql/{query}
   * @response `200` `(Association)[]` Success
   */
  namespace GetSparqlQuery {
    type RequestParams = {
      query: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
}
export declare namespace Pair {
  /**
   * No description
   * @tags pair/sim
   * @name GetPairSimJaccardResource
   * @summary Get pairwise similarity
   * @request GET:/pair/sim/jaccard/{id1}/{id2}
   * @response `200` `void` Success
   */
  namespace GetPairSimJaccardResource {
    type RequestParams = {
      id2: string;
      id1: string;
    };
    type RequestQuery = {
      object_category?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare namespace Relation {
  /**
   * No description
   * @tags relation/usage
   * @name GetRelationUsageResource
   * @summary All relations used plus count of associations
   * @request GET:/relation/usage/
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetRelationUsageResource {
    type RequestParams = {};
    type RequestQuery = {
      subject_taxon?: string;
      evidence?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags relation/usage
   * @name GetRelationUsageBetweenResource
   * @summary All relations used plus count of associations
   * @request GET:/relation/usage/between/{subject_category}/{object_category}
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetRelationUsageBetweenResource {
    type RequestParams = {
      subjectCategory: string;
      objectCategory: string;
    };
    type RequestQuery = {
      subject_taxon?: string;
      evidence?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags relation/usage
   * @name GetRelationUsagePivotResource
   * @summary Relation usage count for all subj x obj category combinations
   * @request GET:/relation/usage/pivot
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetRelationUsagePivotResource {
    type RequestParams = {};
    type RequestQuery = {
      subject_taxon?: string;
      evidence?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
  /**
   * No description
   * @tags relation/usage
   * @name GetRelationUsagePivotLabelResource
   * @summary Relation usage count for all subj x obj category combinations, showing label
   * @request GET:/relation/usage/pivot/label
   * @response `200` `(AssociationResults)[]` Success
   */
  namespace GetRelationUsagePivotLabelResource {
    type RequestParams = {};
    type RequestQuery = {
      subject_taxon?: string;
      evidence?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AssociationResults[];
  }
}
export declare namespace Search {
  /**
   * No description
   * @tags search
   * @name GetAutocomplete
   * @summary Returns list of matching concepts or entities using lexical search
   * @request GET:/search/entity/autocomplete/{term}
   * @response `200` `AutocompleteResults` Success
   */
  namespace GetAutocomplete {
    type RequestParams = {
      term: string;
    };
    type RequestQuery = {
      fq?: string[];
      category?: string[];
      prefix?: string[];
      include_eqs?: boolean;
      boost_fx?: string[];
      boost_q?: string[];
      taxon?: string[];
      rows?: number;
      start?: string;
      highlight_class?: string;
      min_match?: string;
      exclude_groups?: boolean;
      minimal_tokenizer?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = AutocompleteResults;
  }
  /**
   * No description
   * @tags search
   * @name GetSearchHpoEntities
   * @summary Returns list of matching concepts or entities using lexical search
   * @request GET:/search/entity/hpo-pl/{term}
   * @response `200` `LayResults` Success
   */
  namespace GetSearchHpoEntities {
    type RequestParams = {
      term: string;
    };
    type RequestQuery = {
      rows?: number;
      start?: string;
      phenotype_group?: string;
      phenotype_group_label?: string;
      anatomical_system?: string;
      anatomical_system_label?: string;
      highlight_class?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = LayResults;
  }
  /**
   * No description
   * @tags search
   * @name GetSearchEntities
   * @summary Returns list of matching concepts or entities using lexical search
   * @request GET:/search/entity/{term}
   * @response `200` `SearchResult` Success
   */
  namespace GetSearchEntities {
    type RequestParams = {
      term: string;
    };
    type RequestQuery = {
      fq?: string[];
      category?: string[];
      prefix?: string[];
      include_eqs?: boolean;
      boost_fx?: string[];
      boost_q?: string[];
      taxon?: string[];
      rows?: number;
      start?: string;
      highlight_class?: string;
      min_match?: string;
      exclude_groups?: boolean;
      minimal_tokenizer?: boolean;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = SearchResult;
  }
}
export declare namespace Sim {
  /**
   * No description
   * @tags sim
   * @name GetSimCompare
   * @summary Compare a reference profile vs one profiles
   * @request GET:/sim/compare
   * @response `200` `SimResult` Success
   */
  namespace GetSimCompare {
    type RequestParams = {};
    type RequestQuery = {
      is_feature_set?: boolean;
      metric?: "phenodigm" | "jaccard" | "simGIC" | "resnik" | "symmetric_resnik";
      ref_id?: string[];
      query_id?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = SimResult;
  }
  /**
   * No description
   * @tags sim
   * @name PostSimCompare
   * @summary Compare a reference profile vs one or more profiles
   * @request POST:/sim/compare
   * @response `200` `SimResult` Success
   */
  namespace PostSimCompare {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = CompareInput;
    type RequestHeaders = {};
    type ResponseBody = SimResult;
  }
  /**
   * No description
   * @tags sim
   * @name GetAnnotationScore
   * @summary Get annotation score
   * @request GET:/sim/score
   * @response `200` `SufficiencyOutput` Success
   */
  namespace GetAnnotationScore {
    type RequestParams = {};
    type RequestQuery = {
      id?: string[];
      absent_id?: string[];
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = SufficiencyOutput;
  }
  /**
   * No description
   * @tags sim
   * @name PostAnnotationScore
   * @summary Get annotation score
   * @request POST:/sim/score
   * @response `200` `SufficiencyOutput` Success
   */
  namespace PostAnnotationScore {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = SufficiencyPostInput;
    type RequestHeaders = {};
    type ResponseBody = SufficiencyOutput;
  }
  /**
   * No description
   * @tags sim
   * @name GetSimSearch
   * @summary Search for phenotypically similar diseases or model genes
   * @request GET:/sim/search
   * @response `200` `SimResult` Success
   */
  namespace GetSimSearch {
    type RequestParams = {};
    type RequestQuery = {
      is_feature_set?: boolean;
      metric?: "phenodigm" | "jaccard" | "simGIC" | "resnik" | "symmetric_resnik";
      id?: string[];
      limit?: number;
      taxon?: string;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = SimResult;
  }
}
export declare namespace Variation {
  /**
   * No description
   * @tags variation/set
   * @name GetVariantSetsCollection
   * @summary Returns list of variant sets
   * @request GET:/variation/set/
   * @response `200` `PageOfVariantSets` Success
   */
  namespace GetVariantSetsCollection {
    type RequestParams = {};
    type RequestQuery = {
      page?: number;
      per_page?: 2 | 10 | 20 | 30 | 40 | 50;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = PageOfVariantSets;
  }
  /**
   * No description
   * @tags variation/set
   * @name PostVariantSetsCollection
   * @summary Creates a new variant set
   * @request POST:/variation/set/
   * @response `200` `void` Success
   */
  namespace PostVariantSetsCollection {
    type RequestParams = {};
    type RequestQuery = {};
    type RequestBody = VariantSet;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags variation/set
   * @name GetVariantAnalyze
   * @summary Returns list of matches
   * @request GET:/variation/set/analyze/{id}
   * @response `200` `(Association)[]` Success
   */
  namespace GetVariantAnalyze {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = Association[];
  }
  /**
   * No description
   * @tags variation/set
   * @name GetVariantSetsArchiveCollection
   * @summary Returns list of variant sets from a specified time period
   * @request GET:/variation/set/archive/{year}/{month}/{day}
   * @response `200` `PageOfVariantSets` Success
   */
  namespace GetVariantSetsArchiveCollection {
    type RequestParams = {
      year: number;
      month: number;
      day: number;
    };
    type RequestQuery = {
      page?: number;
      per_page?: 2 | 10 | 20 | 30 | 40 | 50;
    };
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = PageOfVariantSets;
  }
  /**
   * No description
   * @tags variation/set
   * @name GetVariantSetItem
   * @summary Returns a variant set
   * @request GET:/variation/set/{id}
   * @response `200` `VariantSet` Success
   * @response `404` `void` VariantSet not found.
   */
  namespace GetVariantSetItem {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = VariantSet;
  }
  /**
   * No description
   * @tags variation/set
   * @name DeleteVariantSetItem
   * @summary Deletes variant set
   * @request DELETE:/variation/set/{id}
   * @response `204` `void` VariantSet successfully deleted.
   * @response `404` `void` VariantSet not found.
   */
  namespace DeleteVariantSetItem {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = never;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
  /**
   * No description
   * @tags variation/set
   * @name PutVariantSetItem
   * @summary Updates a variant set
   * @request PUT:/variation/set/{id}
   * @response `204` `void` VariantSet successfully updated.
   * @response `404` `void` VariantSet not found.
   */
  namespace PutVariantSetItem {
    type RequestParams = {
      id: string;
    };
    type RequestQuery = {};
    type RequestBody = VariantSet;
    type RequestHeaders = {};
    type ResponseBody = void;
  }
}
export declare type QueryParamsType = Record<string | number, any>;
export declare type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;
export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}
export declare type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;
export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}
export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}
declare type CancelToken = Symbol | string | number;
export declare enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}
export declare class HttpClient<SecurityDataType = unknown> {
  baseUrl: string;
  private securityData;
  private securityWorker?;
  private abortControllers;
  private customFetch;
  private baseApiParams;
  constructor(apiConfig?: ApiConfig<SecurityDataType>);
  setSecurityData: (data: SecurityDataType | null) => void;
  private encodeQueryParam;
  private addQueryParam;
  private addArrayQueryParam;
  protected toQueryString(rawQuery?: QueryParamsType): string;
  protected addQueryParams(rawQuery?: QueryParamsType): string;
  private contentFormatters;
  private mergeRequestParams;
  private createAbortSignal;
  abortRequest: (cancelToken: CancelToken) => void;
  request: <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams) => Promise<HttpResponse<T, E>>;
}
/**
 * @title BioLink API
 * @version 1.1.14
 * @license BSD3
 * @baseUrl /api
 *
 * API integration layer for linked biological objects.
 *
 *  __Source:__ https://github.com/biolink/biolink-api/
 */
export declare class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;
  constructor(http: HttpClient<SecurityDataType>);
  association: {
    /**
     * @description Given two entities (e.g. a particular gene and a particular disease), if these two entities are connected (directly or indirectly), then return the association objects describing the connection.
     *
     * @tags association
     * @name GetAssociationsBetween
     * @summary Returns associations connecting two entities
     * @request GET:/association/between/{subject}/{object}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationsBetween: (
      object: string,
      subject: string,
      query?: {
        rows?: number;
        start?: number;
        evidence?: string;
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        use_compact_associations?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags association
     * @name GetAssociationBySubjectCategorySearch
     * @summary Returns list of matching associations for a given subject category
     * @request GET:/association/find/{subject_category}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationBySubjectCategorySearch: (
      subjectCategory: string,
      query?: {
        rows?: number;
        start?: number;
        evidence?: string;
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        use_compact_associations?: boolean;
        subject_taxon?: string;
        object_taxon?: string;
        relation?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags association
     * @name GetAssociationBySubjectAndObjectCategorySearch
     * @summary Returns list of matching associations between a given subject and object category
     * @request GET:/association/find/{subject_category}/{object_category}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationBySubjectAndObjectCategorySearch: (
      objectCategory: string,
      subjectCategory: string,
      query?: {
        rows?: number;
        start?: number;
        evidence?: string;
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        use_compact_associations?: boolean;
        subject?: string;
        object?: string;
        subject_taxon?: string;
        object_taxon?: string;
        relation?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags association
     * @name GetAssociationsFrom
     * @summary Returns list of matching associations starting from a given subject (source)
     * @request GET:/association/from/{subject}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationsFrom: (
      subject: string,
      query?: {
        rows?: number;
        start?: number;
        evidence?: string;
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        use_compact_associations?: boolean;
        object_taxon?: string;
        relation?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags association
     * @name GetAssociationsTo
     * @summary Returns list of matching associations pointing to a given object (target)
     * @request GET:/association/to/{object}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationsTo: (
      object: string,
      query?: {
        rows?: number;
        start?: number;
        evidence?: string;
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        use_compact_associations?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags association
     * @name GetAssociationBySubjectAndAssocType
     * @summary Returns list of matching associations of a given type
     * @request GET:/association/type/{association_type}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationBySubjectAndAssocType: (
      associationType: string,
      query?: {
        rows?: number;
        start?: number;
        evidence?: string;
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        use_compact_associations?: boolean;
        subject?: string;
        object?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * @description An association connects, at a minimum, two things, designated subject and object, via some relationship. Associations also include evidence, provenance etc.
     *
     * @tags association
     * @name GetAssociationObject
     * @summary Returns the association with a given identifier
     * @request GET:/association/{id}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationObject: (id: string, params?: RequestParams) => Promise<HttpResponse<AssociationResults[], any>>;
  };
  bioentity: {
    /**
     * No description
     *
     * @tags bioentity
     * @name GetAnatomyGeneAssociations
     * @summary Returns genes associated with a given anatomy
     * @request GET:/bioentity/anatomy/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getAnatomyGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description For example, + NCBITaxon:10090 (mouse)
     *
     * @tags bioentity
     * @name GetAnatomyGeneByTaxonAssociations
     * @summary Returns gene IDs for all genes associated with a given anatomy, filtered by taxon
     * @request GET:/bioentity/anatomy/{id}/genes/{taxid}
     * @deprecated
     * @response `200` `void` Success
     */
    getAnatomyGeneByTaxonAssociations: (
      taxid: string,
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseDiseaseAssociations
     * @summary Returns diseases associated with a case
     * @request GET:/bioentity/case/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getCaseDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseGenotypeAssociations
     * @summary Returns genotypes associated with a case
     * @request GET:/bioentity/case/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getCaseGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseModelAssociations
     * @summary Returns models associated with a case
     * @request GET:/bioentity/case/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getCaseModelAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCasePhenotypeAssociations
     * @summary Returns phenotypes associated with a case
     * @request GET:/bioentity/case/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getCasePhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseVariantAssociations
     * @summary Returns variants associated with a case
     * @request GET:/bioentity/case/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getCaseVariantAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseCaseAssociations
     * @summary Returns cases associated with a disease
     * @request GET:/bioentity/disease/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getDiseaseCaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseGeneAssociations
     * @summary Returns genes associated with a disease
     * @request GET:/bioentity/disease/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getDiseaseGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
        association_type?: "causal" | "non_causal" | "both";
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseGenotypeAssociations
     * @summary Returns genotypes associated with a disease
     * @request GET:/bioentity/disease/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getDiseaseGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description In the association object returned, the subject will be the disease, and the object will be the model. The model may be a gene or genetic element. If the query disease is a general class, the association subject may be to a specific disease. In some cases the association will be *direct*, for example if a paper asserts a genotype is a model of a disease. In other cases, the association will be *indirect*, for example, chaining over orthology. In these cases the chain will be reflected in the *evidence graph* * TODO: provide hook into owlsim for dynamic computation of models by similarity
     *
     * @tags bioentity
     * @name GetDiseaseModelAssociations
     * @summary Returns associations to models of the disease
     * @request GET:/bioentity/disease/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getDiseaseModelAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description See /disease/<id>/models route for full details
     *
     * @tags bioentity
     * @name GetDiseaseModelTaxonAssociations
     * @summary Returns associations to models of the disease constrained by taxon
     * @request GET:/bioentity/disease/{id}/models/{taxon}
     * @deprecated
     * @response `200` `AssociationResults` Success
     */
    getDiseaseModelTaxonAssociations: (
      taxon: string,
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseasePathwayAssociations
     * @summary Returns pathways associated with a disease
     * @request GET:/bioentity/disease/{id}/pathways
     * @response `200` `AssociationResults` Success
     */
    getDiseasePathwayAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseasePhenotypeAssociations
     * @summary Returns phenotypes associated with disease
     * @request GET:/bioentity/disease/{id}/phenotypes
     * @response `200` `D2PAssociationResults` Success
     */
    getDiseasePhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<D2PAssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseasePublicationAssociations
     * @summary Returns publications associated with a disease
     * @request GET:/bioentity/disease/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getDiseasePublicationAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description e.g. drugs or small molecules used to treat
     *
     * @tags bioentity
     * @name GetDiseaseSubstanceAssociations
     * @summary Returns substances associated with a disease
     * @request GET:/bioentity/disease/{id}/treatment
     * @response `200` `void` Success
     */
    getDiseaseSubstanceAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseVariantAssociations
     * @summary Returns variants associated with a disease
     * @request GET:/bioentity/disease/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getDiseaseVariantAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionAssociations
     * @summary Returns annotations associated to a function term
     * @request GET:/bioentity/function/{id}
     * @response `200` `void` Success
     */
    getFunctionAssociations: (
      id: string,
      query?: {
        start?: number;
        rows?: number;
        evidence?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionGeneAssociations
     * @summary Returns genes associated to a GO term
     * @request GET:/bioentity/function/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getFunctionGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
        relationship_type?: "involved_in" | "involved_in_regulation_of" | "acts_upstream_of_or_within";
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionPublicationAssociations
     * @summary Returns publications associated to a GO term
     * @request GET:/bioentity/function/{id}/publications
     * @response `200` `void` Success
     */
    getFunctionPublicationAssociations: (
      id: string,
      query?: {
        start?: number;
        rows?: number;
        evidence?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionTaxonAssociations
     * @summary Returns taxons associated to a GO term
     * @request GET:/bioentity/function/{id}/taxons
     * @response `200` `void` Success
     */
    getFunctionTaxonAssociations: (
      id: string,
      query?: {
        start?: number;
        rows?: number;
        evidence?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneAnatomyAssociations
     * @summary Returns anatomical entities associated with a gene
     * @request GET:/bioentity/gene/{id}/anatomy
     * @response `200` `AssociationResults` Success
     */
    getGeneAnatomyAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneCaseAssociations
     * @summary Returns cases associated with a gene
     * @request GET:/bioentity/gene/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getGeneCaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneDiseaseAssociations
     * @summary Returns diseases associated with gene
     * @request GET:/bioentity/gene/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getGeneDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
        association_type?: "causal" | "non_causal" | "both";
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneExpressionAssociations
     * @summary Returns expression events for a gene
     * @request GET:/bioentity/gene/{id}/expression/anatomy
     * @response `200` `AssociationResults` Success
     */
    getGeneExpressionAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description IMPLEMENTATION DETAILS ---------------------- Note: currently this is implemented as a query to the GO/AmiGO solr instance. This directly supports IDs such as: - ZFIN e.g. ZFIN:ZDB-GENE-050417-357 Note that the AmiGO GOlr natively stores MGI annotations to MGI:MGI:nn. However, the standard for biolink is MGI:nnnn, so you should use this (will be transparently mapped to legacy ID) Additionally, for some species such as Human, GO has the annotation attached to the UniProt ID. Again, this should be transparently handled; e.g. you can use NCBIGene:6469, and this will be mapped behind the scenes for querying.
     *
     * @tags bioentity
     * @name GetGeneFunctionAssociations
     * @summary Returns function associations for a gene
     * @request GET:/bioentity/gene/{id}/function
     * @response `200` `AssociationResults` Success
     */
    getGeneFunctionAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneGenotypeAssociations
     * @summary Returns genotypes associated with a gene
     * @request GET:/bioentity/gene/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getGeneGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneHomologAssociations
     * @summary Returns homologs for a gene
     * @request GET:/bioentity/gene/{id}/homologs
     * @response `200` `AssociationResults` Success
     */
    getGeneHomologAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        homology_type?: "P" | "O" | "LDO";
        direct_taxon?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneInteractions
     * @summary Returns interactions for a gene
     * @request GET:/bioentity/gene/{id}/interactions
     * @response `200` `AssociationResults` Success
     */
    getGeneInteractions: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneModelAssociations
     * @summary Returns models associated with a gene
     * @request GET:/bioentity/gene/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getGeneModelAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneOrthologDiseaseAssociations
     * @summary Return diseases associated with orthologs of a gene
     * @request GET:/bioentity/gene/{id}/ortholog/diseases
     * @response `200` `AssociationResults` Success
     */
    getGeneOrthologDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneOrthologPhenotypeAssociations
     * @summary Return phenotypes associated with orthologs for a gene
     * @request GET:/bioentity/gene/{id}/ortholog/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getGeneOrthologPhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenePathwayAssociations
     * @summary Returns pathways associated with gene
     * @request GET:/bioentity/gene/{id}/pathways
     * @response `200` `AssociationResults` Success
     */
    getGenePathwayAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenePhenotypeAssociations
     * @summary Returns phenotypes associated with gene
     * @request GET:/bioentity/gene/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getGenePhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenePublicationAssociations
     * @summary Returns publications associated with a gene
     * @request GET:/bioentity/gene/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getGenePublicationAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneVariantAssociations
     * @summary Returns variants associated with a gene
     * @request GET:/bioentity/gene/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getGeneVariantAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeCaseAssociations
     * @summary Returns cases associated with a genotype
     * @request GET:/bioentity/genotype/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getGenotypeCaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeDiseaseAssociations
     * @summary Returns diseases associated with a genotype
     * @request GET:/bioentity/genotype/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getGenotypeDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeGeneAssociations
     * @summary Returns genes associated with a genotype
     * @request GET:/bioentity/genotype/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getGenotypeGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description Genotypes may be related to one another according to the GENO model
     *
     * @tags bioentity
     * @name GetGenotypeGenotypeAssociations
     * @summary Returns genotypes-genotype associations
     * @request GET:/bioentity/genotype/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getGenotypeGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeModelAssociations
     * @summary Returns models associated with a genotype
     * @request GET:/bioentity/genotype/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getGenotypeModelAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypePhenotypeAssociations
     * @summary Returns phenotypes associated with a genotype
     * @request GET:/bioentity/genotype/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getGenotypePhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypePublicationAssociations
     * @summary Returns publications associated with a genotype
     * @request GET:/bioentity/genotype/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getGenotypePublicationAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeVariantAssociations
     * @summary Returns genotypes-variant associations
     * @request GET:/bioentity/genotype/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getGenotypeVariantAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGotermGeneAssociations
     * @summary Returns associations to GO terms for a gene
     * @request GET:/bioentity/goterm/{id}/genes
     * @deprecated
     * @response `200` `AssociationResults` Success
     */
    getGotermGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        relationship_type?: "involved_in" | "involved_in_regulation_of" | "acts_upstream_of_or_within";
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelCaseAssociations
     * @summary Returns cases associated with a model
     * @request GET:/bioentity/model/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getModelCaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelDiseaseAssociations
     * @summary Returns diseases associated with a model
     * @request GET:/bioentity/model/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getModelDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelGeneAssociations
     * @summary Returns genes associated with a model
     * @request GET:/bioentity/model/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getModelGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelGenotypeAssociations
     * @summary Returns genotypes associated with a model
     * @request GET:/bioentity/model/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getModelGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelPhenotypeAssociations
     * @summary Returns phenotypes associated with a model
     * @request GET:/bioentity/model/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getModelPhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelPublicationAssociations
     * @summary Returns publications associated with a model
     * @request GET:/bioentity/model/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getModelPublicationAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelVariantAssociations
     * @summary Returns variants associated with a model
     * @request GET:/bioentity/model/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getModelVariantAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPathwayDiseaseAssociations
     * @summary Returns diseases associated with a pathway
     * @request GET:/bioentity/pathway/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getPathwayDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPathwayGeneAssociations
     * @summary Returns genes associated with a pathway
     * @request GET:/bioentity/pathway/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getPathwayGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPathwayPhenotypeAssociations
     * @summary Returns phenotypes associated with a pathway
     * @request GET:/bioentity/pathway/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getPathwayPhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description Example IDs: * MP:0008521 abnormal Bowman membrane
     *
     * @tags bioentity
     * @name GetPhenotypeAnatomyAssociations
     * @summary Returns anatomical entities associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/anatomy
     * @response `200` `(NamedObject)[]` Success
     */
    getPhenotypeAnatomyAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<NamedObject[], any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeCaseAssociations
     * @summary Returns cases associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeCaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeDiseaseAssociations
     * @summary Returns diseases associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/diseases
     * @response `200` `D2PAssociationResults` Success
     */
    getPhenotypeDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<D2PAssociationResults, any>>;
    /**
     * @description For example, MP:0001569 + NCBITaxon:10090 (mouse)
     *
     * @tags bioentity
     * @name GetPhenotypeGeneByTaxonAssociations
     * @summary Returns gene IDs for all genes associated with a given phenotype, filtered by taxon
     * @request GET:/bioentity/phenotype/{id}/gene/{taxid}/ids
     * @deprecated
     * @response `200` `void` Success
     */
    getPhenotypeGeneByTaxonAssociations: (
      taxid: string,
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeGeneAssociations
     * @summary Returns genes associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeGenotypeAssociations
     * @summary Returns genotypes associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypePathwayAssociations
     * @summary Returns pathways associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/pathways
     * @response `200` `AssociationResults` Success
     */
    getPhenotypePathwayAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypePublicationAssociations
     * @summary Returns publications associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getPhenotypePublicationAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeVariantAssociations
     * @summary Returns variants associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeVariantAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationDiseaseAssociations
     * @summary Returns diseases associated with a publication
     * @request GET:/bioentity/publication/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getPublicationDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationGeneAssociations
     * @summary Returns genes associated with a publication
     * @request GET:/bioentity/publication/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getPublicationGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationGenotypeAssociations
     * @summary Returns genotypes associated with a publication
     * @request GET:/bioentity/publication/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getPublicationGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationModelAssociations
     * @summary Returns models associated with a publication
     * @request GET:/bioentity/publication/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getPublicationModelAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationPhenotypeAssociations
     * @summary Returns phenotypes associated with a publication
     * @request GET:/bioentity/publication/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getPublicationPhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationVariantAssociations
     * @summary Returns variants associated with a publication
     * @request GET:/bioentity/publication/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getPublicationVariantAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * @description Examples relationships: * substance is a metabolite of a process * substance is synthesized by a process * substance is modified by an activity * substance elicits a response program/pathway * substance is transported by activity or pathway For example, CHEBI:40036 (amitrole)
     *
     * @tags bioentity
     * @name GetSubstanceParticipantInAssociations
     * @summary Returns associations between an activity and process and the specified substance
     * @request GET:/bioentity/substance/{id}/participant_in
     * @response `200` `(Association)[]` Success
     */
    getSubstanceParticipantInAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<Association[], any>>;
    /**
     * @description Roles may be human-oriented (e.g. pesticide) or molecular (e.g. enzyme inhibitor)
     *
     * @tags bioentity
     * @name GetSubstanceRoleAssociations
     * @summary Returns associations between given drug and roles
     * @request GET:/bioentity/substance/{id}/roles
     * @response `200` `(Association)[]` Success
     */
    getSubstanceRoleAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<Association[], any>>;
    /**
     * @description e.g. drugs or small molecules used to treat
     *
     * @tags bioentity
     * @name GetSubstanceTreatsAssociations
     * @summary Returns substances associated with a disease
     * @request GET:/bioentity/substance/{id}/treats
     * @response `200` `void` Success
     */
    getSubstanceTreatsAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantCaseAssociations
     * @summary Returns cases associated with a variant
     * @request GET:/bioentity/variant/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getVariantCaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantDiseaseAssociations
     * @summary Returns diseases associated with a variant
     * @request GET:/bioentity/variant/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getVariantDiseaseAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantGeneAssociations
     * @summary Returns genes associated with a variant
     * @request GET:/bioentity/variant/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getVariantGeneAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantGenotypeAssociations
     * @summary Returns genotypes associated with a variant
     * @request GET:/bioentity/variant/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getVariantGenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantModelAssociations
     * @summary Returns models associated with a variant
     * @request GET:/bioentity/variant/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getVariantModelAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantPhenotypeAssociations
     * @summary Returns phenotypes associated with a variant
     * @request GET:/bioentity/variant/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getVariantPhenotypeAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantPublicationAssociations
     * @summary Returns publications associated with a variant
     * @request GET:/bioentity/variant/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getVariantPublicationAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenericObject
     * @summary Returns basic info on object of any type
     * @request GET:/bioentity/{id}
     * @response `200` `BioObject` Success
     */
    getGenericObject: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<BioObject, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenericAssociations
     * @summary Returns associations for an entity regardless of the type
     * @request GET:/bioentity/{id}/associations
     * @response `200` `AssociationResults` Success
     */
    getGenericAssociations: (
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        taxon?: string[];
        direct_taxon?: boolean;
        relation?: string;
        sort?: string;
        q?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults, any>>;
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenericObjectByType
     * @summary Return basic info on an object for a given type
     * @request GET:/bioentity/{type}/{id}
     * @response `200` `void` Success
     */
    getGenericObjectByType: (
      type:
        | "gene"
        | "variant"
        | "genotype"
        | "phenotype"
        | "disease"
        | "goterm"
        | "pathway"
        | "anatomy"
        | "substance"
        | "individual"
        | "publication"
        | "model"
        | "case",
      id: string,
      query?: {
        rows?: number;
        start?: number;
        facet?: boolean;
        facet_fields?: string[];
        unselect_evidence?: boolean;
        exclude_automatic_assertions?: boolean;
        fetch_objects?: boolean;
        use_compact_associations?: boolean;
        slim?: string[];
        evidence?: string;
        direct?: boolean;
        get_association_counts?: boolean;
        distinct_counts?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  bioentityset: {
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetEntitySetAssociations
     * @summary Returns compact associations for a given input set
     * @request GET:/bioentityset/associations
     * @response `200` `(AssociationResults)[]` Success
     */
    getEntitySetAssociations: (
      query?: {
        subject?: string[];
        background?: string[];
        object_category?: string;
        object_slim?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetEntitySetSummary
     * @summary Summary statistics for objects associated
     * @request GET:/bioentityset/descriptor/counts
     * @response `200` `void` Success
     */
    getEntitySetSummary: (
      query?: {
        subject?: string[];
        background?: string[];
        object_category?: string;
        object_slim?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetEntitySetGraphResource
     * @summary TODO Graph object spanning all entities
     * @request GET:/bioentityset/graph
     * @response `200` `void` Success
     */
    getEntitySetGraphResource: (
      query?: {
        subject?: string[];
        background?: string[];
        object_category?: string;
        object_slim?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentityset/homologs
     * @name GetEntitySetHomologs
     * @summary Returns homology associations for a given input set of genes
     * @request GET:/bioentityset/homologs/
     * @response `200` `(AssociationResults)[]` Success
     */
    getEntitySetHomologs: (
      query?: {
        subject?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetOverRepresentation
     * @summary Summary statistics for objects associated
     * @request GET:/bioentityset/overrepresentation
     * @response `200` `void` Success
     */
    getOverRepresentation: (
      query?: {
        object_category?: string;
        subject?: string[];
        background?: string[];
        subject_category?: string;
        max_p_value?: string;
        ontology?: string;
        taxon?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentityset/slimmer
     * @name GetEntitySetAnatomySlimmer
     * @summary For a given gene(s), summarize its annotations over a defined set of slim
     * @request GET:/bioentityset/slimmer/anatomy
     * @response `200` `void` Success
     */
    getEntitySetAnatomySlimmer: (
      query: {
        subject: string[];
        slim: string[];
        exclude_automatic_assertions?: boolean;
        rows?: number;
        start?: number;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentityset/slimmer
     * @name GetEntitySetFunctionSlimmer
     * @summary For a given gene(s), summarize its annotations over a defined set of slim
     * @request GET:/bioentityset/slimmer/function
     * @response `200` `void` Success
     */
    getEntitySetFunctionSlimmer: (
      query: {
        relationship_type?: "involved_in" | "acts_upstream_of_or_within";
        subject: string[];
        slim: string[];
        exclude_automatic_assertions?: boolean;
        rows?: number;
        start?: number;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags bioentityset/slimmer
     * @name GetEntitySetPhenotypeSlimmer
     * @summary For a given gene(s), summarize its annotations over a defined set of slim
     * @request GET:/bioentityset/slimmer/phenotype
     * @response `200` `void` Success
     */
    getEntitySetPhenotypeSlimmer: (
      query: {
        subject: string[];
        slim: string[];
        exclude_automatic_assertions?: boolean;
        rows?: number;
        start?: number;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  cam: {
    /**
     * No description
     *
     * @tags cam
     * @name GetActivityCollection
     * @summary Returns list of models
     * @request GET:/cam/activity
     * @response `200` `void` Success
     */
    getActivityCollection: (
      query?: {
        title?: string;
        contributor?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetInstanceObject
     * @summary Returns list of matches
     * @request GET:/cam/instance/{id}
     * @response `200` `(Association)[]` Success
     */
    getInstanceObject: (
      id: string,
      query?: {
        title?: string;
        contributor?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<Association[], any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetModelInstances
     * @summary Returns list of all instances
     * @request GET:/cam/instances
     * @response `200` `void` Success
     */
    getModelInstances: (params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetModelCollection
     * @summary Returns list of ALL models
     * @request GET:/cam/model
     * @response `200` `void` Success
     */
    getModelCollection: (params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetModelContributors
     * @summary Returns list of all contributors across all models
     * @request GET:/cam/model/contributors
     * @response `200` `void` Success
     */
    getModelContributors: (params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetModelProperties
     * @summary Returns list of all properties used across all models
     * @request GET:/cam/model/properties
     * @response `200` `void` Success
     */
    getModelProperties: (
      query?: {
        title?: string;
        contributor?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetModelPropertyValues
     * @summary Returns list property-values for all models
     * @request GET:/cam/model/property_values
     * @response `200` `void` Success
     */
    getModelPropertyValues: (
      query?: {
        title?: string;
        contributor?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetModelQuery
     * @summary Returns list of models matching query
     * @request GET:/cam/model/query
     * @response `200` `void` Success
     */
    getModelQuery: (
      query?: {
        title?: string;
        contributor?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetModelObject
     * @summary Returns a complete model
     * @request GET:/cam/model/{id}
     * @response `200` `void` Success
     */
    getModelObject: (id: string, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags cam
     * @name GetPhysicalInteraction
     * @summary Returns list of models
     * @request GET:/cam/physical_interaction
     * @response `200` `void` Success
     */
    getPhysicalInteraction: (
      query?: {
        title?: string;
        contributor?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  evidence: {
    /**
     * @description Note that every association is assumed to have a unique ID
     *
     * @tags evidence/graph
     * @name GetEvidenceGraphObject
     * @summary Returns evidence graph object for a given association
     * @request GET:/evidence/graph/{id}
     * @response `200` `(Graph)[]` Success
     */
    getEvidenceGraphObject: (id: string, params?: RequestParams) => Promise<HttpResponse<Graph[], any>>;
    /**
     * @description Note that every association is assumed to have a unique ID
     *
     * @tags evidence/graph
     * @name GetEvidenceGraphTable
     * @summary Returns evidence as a association_results object given an association
     * @request GET:/evidence/graph/{id}/table
     * @response `200` `(AssociationResults)[]` Success
     */
    getEvidenceGraphTable: (
      id: string,
      query?: {
        is_publication?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
  };
  genome: {
    /**
     * No description
     *
     * @tags genome/features
     * @name GetFeaturesWithinResource
     * @summary Returns list of matches
     * @request GET:/genome/features/within/{build}/{reference}/{begin}/{end}
     * @response `200` `(SequenceFeature)[]` Success
     */
    getFeaturesWithinResource: (
      build: string,
      reference: string,
      begin: string,
      end: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<SequenceFeature[], any>>;
  };
  graph: {
    /**
     * No description
     *
     * @tags graph
     * @name GetEdgeResource
     * @summary Returns edges emanating from a given node
     * @request GET:/graph/edges/from/{id}
     * @response `200` `(Graph)[]` Success
     */
    getEdgeResource: (
      id: string,
      query?: {
        depth?: number;
        direction?: "INCOMING" | "OUTGOING" | "BOTH";
        relationship_type?: string[];
        entail?: boolean;
        graph?: "data" | "ontology";
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<Graph[], any>>;
    /**
     * @description A node is an abstract representation of some kind of entity. The entity may be a physical thing such as a patient, a molecular entity such as a gene or protein, or a conceptual entity such as a class from an ontology.
     *
     * @tags graph
     * @name GetNodeResource
     * @summary Returns a graph node
     * @request GET:/graph/node/{id}
     * @response `200` `(BioObject)[]` Success
     */
    getNodeResource: (id: string, params?: RequestParams) => Promise<HttpResponse<BioObject[], any>>;
  };
  identifier: {
    /**
     * No description
     *
     * @tags identifier/mapper
     * @name GetIdentifierMapper
     * @summary TODO maps a list of identifiers from a source to a target
     * @request GET:/identifier/mapper/{source}/{target}/
     * @response `200` `(Association)[]` Success
     */
    getIdentifierMapper: (
      source: string,
      target: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<Association[], any>>;
    /**
     * No description
     *
     * @tags identifier/prefixes
     * @name GetPrefixCollection
     * @summary Returns list of prefixes
     * @request GET:/identifier/prefixes/
     * @response `200` `void` Success
     */
    getPrefixCollection: (params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags identifier/prefixes
     * @name GetPrefixContract
     * @summary Returns contracted URI
     * @request GET:/identifier/prefixes/contract/{uri}
     * @response `200` `void` Success
     */
    getPrefixContract: (uri: string, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags identifier/prefixes
     * @name GetPrefixExpand
     * @summary Returns expanded URI
     * @request GET:/identifier/prefixes/expand/{id}
     * @response `200` `void` Success
     */
    getPrefixExpand: (id: string, params?: RequestParams) => Promise<HttpResponse<void, any>>;
  };
  individual: {
    /**
     * No description
     *
     * @tags individual
     * @name GetPedigree
     * @summary Returns list of matches
     * @request GET:/individual/pedigree/{id}
     * @response `200` `(Association)[]` Success
     */
    getPedigree: (id: string, params?: RequestParams) => Promise<HttpResponse<Association[], any>>;
    /**
     * No description
     *
     * @tags individual
     * @name GetIndividual
     * @summary Returns list of matches
     * @request GET:/individual/{id}
     * @response `200` `(Association)[]` Success
     */
    getIndividual: (id: string, params?: RequestParams) => Promise<HttpResponse<Association[], any>>;
  };
  mart: {
    /**
     * @description NOTE: this route has a limiter on it, you may be restricted in the number of downloads per hour. Use carefully.
     *
     * @tags mart
     * @name GetMartCaseAssociationsResource
     * @summary Bulk download of case associations
     * @request GET:/mart/case/{object_category}/{taxon}
     * @response `200` `void` Success
     */
    getMartCaseAssociationsResource: (
      taxon: string,
      objectCategory: string,
      query?: {
        slim?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * @description NOTE: this route has a limiter on it, you may be restricted in the number of downloads per hour. Use carefully.
     *
     * @tags mart
     * @name GetMartDiseaseAssociationsResource
     * @summary Bulk download of disease associations
     * @request GET:/mart/disease/{object_category}/{taxon}
     * @response `200` `void` Success
     */
    getMartDiseaseAssociationsResource: (
      taxon: string,
      objectCategory: string,
      query?: {
        slim?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * @description NOTE: this route has a limiter on it, you may be restricted in the number of downloads per hour. Use carefully.
     *
     * @tags mart
     * @name GetMartGeneAssociationsResource
     * @summary Bulk download of gene associations
     * @request GET:/mart/gene/{object_category}/{taxon}
     * @response `200` `void` Success
     */
    getMartGeneAssociationsResource: (
      taxon: string,
      objectCategory: string,
      query?: {
        slim?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags mart
     * @name GetMartOrthologAssociationsResource
     * @summary Bulk download of orthologs
     * @request GET:/mart/ortholog/{taxon1}/{taxon2}
     * @response `200` `void` Success
     */
    getMartOrthologAssociationsResource: (
      taxon2: string,
      taxon1: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags mart
     * @name GetMartParalogAssociationsResource
     * @summary Bulk download of paralogs
     * @request GET:/mart/paralog/{taxon1}/{taxon2}
     * @response `200` `void` Success
     */
    getMartParalogAssociationsResource: (
      taxon2: string,
      taxon1: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  metadata: {
    /**
     * No description
     *
     * @tags metadata
     * @name GetMetadataForDatasets
     * @summary Get metadata for all datasets from SciGraph
     * @request GET:/metadata/datasets
     * @response `200` `void` Success
     */
    getMetadataForDatasets: (params?: RequestParams) => Promise<HttpResponse<void, any>>;
  };
  mme: {
    /**
     * No description
     *
     * @tags mme
     * @name PostDiseaseMme
     * @summary Match a patient to diseases based on their phenotypes
     * @request POST:/mme/disease
     * @response `200` `void` Success
     */
    postDiseaseMme: (payload: Mme, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags mme
     * @name PostFlyMme
     * @summary Match a patient to fruit fly genes based on similar phenotypes
     * @request POST:/mme/fly
     * @response `200` `void` Success
     */
    postFlyMme: (payload: Mme, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags mme
     * @name PostMouseMme
     * @summary Match a patient to mouse genes based on similar phenotypes
     * @request POST:/mme/mouse
     * @response `200` `void` Success
     */
    postMouseMme: (payload: Mme, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags mme
     * @name PostNematodeMme
     * @summary Match a patient to nematode genes based on similar phenotypes
     * @request POST:/mme/nematode
     * @response `200` `void` Success
     */
    postNematodeMme: (payload: Mme, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags mme
     * @name PostZebrafishMme
     * @summary Match a patient to zebrafish genes based on similar phenotypes
     * @request POST:/mme/zebrafish
     * @response `200` `void` Success
     */
    postZebrafishMme: (payload: Mme, params?: RequestParams) => Promise<HttpResponse<void, any>>;
  };
  nlp: {
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name GetAnnotate
     * @summary Annotate a given text using SciGraph annotator
     * @request GET:/nlp/annotate/
     * @response `200` `void` Success
     */
    getAnnotate: (
      query?: {
        content?: string;
        include_category?: string[];
        exclude_category?: string[];
        min_length?: string;
        longest_only?: boolean;
        include_abbreviation?: boolean;
        include_acronym?: boolean;
        include_numbers?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name PostAnnotate
     * @summary Annotate a given text using SciGraph annotator
     * @request POST:/nlp/annotate/
     * @response `200` `void` Success
     */
    postAnnotate: (
      query?: {
        content?: string;
        include_category?: string[];
        exclude_category?: string[];
        min_length?: string;
        longest_only?: boolean;
        include_abbreviation?: boolean;
        include_acronym?: boolean;
        include_numbers?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name GetAnnotateEntities
     * @summary Annotate a given content using SciGraph annotator and get all entities from content
     * @request GET:/nlp/annotate/entities
     * @response `200` `EntityAnnotationResult` Success
     */
    getAnnotateEntities: (
      query?: {
        content?: string;
        include_category?: string[];
        exclude_category?: string[];
        min_length?: string;
        longest_only?: boolean;
        include_abbreviation?: boolean;
        include_acronym?: boolean;
        include_numbers?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<EntityAnnotationResult, any>>;
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name PostAnnotateEntities
     * @summary Annotate a given content using SciGraph annotator and get all entities from content
     * @request POST:/nlp/annotate/entities
     * @response `200` `EntityAnnotationResult` Success
     */
    postAnnotateEntities: (
      query?: {
        content?: string;
        include_category?: string[];
        exclude_category?: string[];
        min_length?: string;
        longest_only?: boolean;
        include_abbreviation?: boolean;
        include_acronym?: boolean;
        include_numbers?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<EntityAnnotationResult, any>>;
  };
  ontol: {
    /**
     * @description ``` IC = -log2( freq(t) / popSize ) ``` Here the frequency and population is calculated for a particular dataset: e.g. all human disease-phenotype associations
     *
     * @tags ontol
     * @name GetInformationContentResource
     * @summary Returns information content (IC) for a set of relevant ontology classes
     * @request GET:/ontol/information_content/{subject_category}/{object_category}/{subject_taxon}
     * @response `200` `void` Success
     */
    getInformationContentResource: (
      subjectCategory: string,
      objectCategory: string,
      subjectTaxon: string,
      query?: {
        evidence?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontol/labeler
     * @name GetOntolLabelerResource
     * @summary Fetches a map from CURIEs/IDs to labels
     * @request GET:/ontol/labeler/
     * @response `200` `void` Success
     */
    getOntolLabelerResource: (
      query?: {
        id?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontol
     * @name GetExtractOntologySubgraphResource
     * @summary Extract a subgraph from an ontology
     * @request GET:/ontol/subgraph/{ontology}/{node}
     * @response `200` `void` Success
     */
    getExtractOntologySubgraphResource: (
      node: string,
      ontology: string,
      query?: {
        cnode?: string[];
        include_ancestors?: boolean;
        include_descendants?: boolean;
        relation?: string[];
        include_meta?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontol
     * @name PostExtractOntologySubgraphResource
     * @summary Extract a subgraph from an ontology
     * @request POST:/ontol/subgraph/{ontology}/{node}
     * @response `200` `void` Success
     */
    postExtractOntologySubgraphResource: (
      node: string,
      ontology: string,
      query?: {
        cnode?: string[];
        include_ancestors?: boolean;
        include_descendants?: boolean;
        relation?: string[];
        include_meta?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  ontology: {
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermsSharedAncestor
     * @summary Returns the ancestor ontology terms shared by two ontology terms
     * @request GET:/ontology/shared/{subject}/{object}
     * @response `200` `void` Success
     */
    getOntologyTermsSharedAncestor: (
      subject: string,
      object: string,
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologySubset
     * @summary Returns meta data of an ontology subset (slim)
     * @request GET:/ontology/subset/{id}
     * @response `200` `void` Success
     */
    getOntologySubset: (id: string, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTerm
     * @summary Returns meta data of an ontology term
     * @request GET:/ontology/term/{id}
     * @response `200` `void` Success
     */
    getOntologyTerm: (id: string, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermGraph
     * @summary Returns graph of an ontology term
     * @request GET:/ontology/term/{id}/graph
     * @response `200` `void` Success
     */
    getOntologyTermGraph: (
      id: string,
      query?: {
        graph_type?:
          | "topology_graph"
          | "regulates_transitivity_graph"
          | "neighborhood_graph"
          | "neighborhood_limited_graph";
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermSubgraph
     * @summary Extract a subgraph from an ontology term
     * @request GET:/ontology/term/{id}/subgraph
     * @response `200` `void` Success
     */
    getOntologyTermSubgraph: (
      id: string,
      query?: {
        cnode?: string[];
        include_ancestors?: boolean;
        include_descendants?: boolean;
        relation?: string[];
        include_meta?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermSubsets
     * @summary Returns subsets (slims) associated to an ontology term
     * @request GET:/ontology/term/{id}/subsets
     * @response `200` `void` Success
     */
    getOntologyTermSubsets: (id: string, params?: RequestParams) => Promise<HttpResponse<void, any>>;
  };
  owl: {
    /**
     * No description
     *
     * @tags owl/ontology
     * @name GetDlQuery
     * @summary Placeholder - use OWLery for now
     * @request GET:/owl/ontology/dlquery/{query}
     * @response `200` `(Association)[]` Success
     */
    getDlQuery: (query: string, params?: RequestParams) => Promise<HttpResponse<Association[], any>>;
    /**
     * No description
     *
     * @tags owl/ontology
     * @name GetSparqlQuery
     * @summary Placeholder - use direct SPARQL endpoint for now
     * @request GET:/owl/ontology/sparql/{query}
     * @response `200` `(Association)[]` Success
     */
    getSparqlQuery: (query: string, params?: RequestParams) => Promise<HttpResponse<Association[], any>>;
  };
  pair: {
    /**
     * No description
     *
     * @tags pair/sim
     * @name GetPairSimJaccardResource
     * @summary Get pairwise similarity
     * @request GET:/pair/sim/jaccard/{id1}/{id2}
     * @response `200` `void` Success
     */
    getPairSimJaccardResource: (
      id2: string,
      id1: string,
      query?: {
        object_category?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<void, any>>;
  };
  relation: {
    /**
     * No description
     *
     * @tags relation/usage
     * @name GetRelationUsageResource
     * @summary All relations used plus count of associations
     * @request GET:/relation/usage/
     * @response `200` `(AssociationResults)[]` Success
     */
    getRelationUsageResource: (
      query?: {
        subject_taxon?: string;
        evidence?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags relation/usage
     * @name GetRelationUsageBetweenResource
     * @summary All relations used plus count of associations
     * @request GET:/relation/usage/between/{subject_category}/{object_category}
     * @response `200` `(AssociationResults)[]` Success
     */
    getRelationUsageBetweenResource: (
      subjectCategory: string,
      objectCategory: string,
      query?: {
        subject_taxon?: string;
        evidence?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags relation/usage
     * @name GetRelationUsagePivotResource
     * @summary Relation usage count for all subj x obj category combinations
     * @request GET:/relation/usage/pivot
     * @response `200` `(AssociationResults)[]` Success
     */
    getRelationUsagePivotResource: (
      query?: {
        subject_taxon?: string;
        evidence?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
    /**
     * No description
     *
     * @tags relation/usage
     * @name GetRelationUsagePivotLabelResource
     * @summary Relation usage count for all subj x obj category combinations, showing label
     * @request GET:/relation/usage/pivot/label
     * @response `200` `(AssociationResults)[]` Success
     */
    getRelationUsagePivotLabelResource: (
      query?: {
        subject_taxon?: string;
        evidence?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AssociationResults[], any>>;
  };
  search: {
    /**
     * No description
     *
     * @tags search
     * @name GetAutocomplete
     * @summary Returns list of matching concepts or entities using lexical search
     * @request GET:/search/entity/autocomplete/{term}
     * @response `200` `AutocompleteResults` Success
     */
    getAutocomplete: (
      term: string,
      query?: {
        fq?: string[];
        category?: string[];
        prefix?: string[];
        include_eqs?: boolean;
        boost_fx?: string[];
        boost_q?: string[];
        taxon?: string[];
        rows?: number;
        start?: string;
        highlight_class?: string;
        min_match?: string;
        exclude_groups?: boolean;
        minimal_tokenizer?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<AutocompleteResults, any>>;
    /**
     * No description
     *
     * @tags search
     * @name GetSearchHpoEntities
     * @summary Returns list of matching concepts or entities using lexical search
     * @request GET:/search/entity/hpo-pl/{term}
     * @response `200` `LayResults` Success
     */
    getSearchHpoEntities: (
      term: string,
      query?: {
        rows?: number;
        start?: string;
        phenotype_group?: string;
        phenotype_group_label?: string;
        anatomical_system?: string;
        anatomical_system_label?: string;
        highlight_class?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<LayResults, any>>;
    /**
     * No description
     *
     * @tags search
     * @name GetSearchEntities
     * @summary Returns list of matching concepts or entities using lexical search
     * @request GET:/search/entity/{term}
     * @response `200` `SearchResult` Success
     */
    getSearchEntities: (
      term: string,
      query?: {
        fq?: string[];
        category?: string[];
        prefix?: string[];
        include_eqs?: boolean;
        boost_fx?: string[];
        boost_q?: string[];
        taxon?: string[];
        rows?: number;
        start?: string;
        highlight_class?: string;
        min_match?: string;
        exclude_groups?: boolean;
        minimal_tokenizer?: boolean;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<SearchResult, any>>;
  };
  sim: {
    /**
     * No description
     *
     * @tags sim
     * @name GetSimCompare
     * @summary Compare a reference profile vs one profiles
     * @request GET:/sim/compare
     * @response `200` `SimResult` Success
     */
    getSimCompare: (
      query?: {
        is_feature_set?: boolean;
        metric?: "phenodigm" | "jaccard" | "simGIC" | "resnik" | "symmetric_resnik";
        ref_id?: string[];
        query_id?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<SimResult, any>>;
    /**
     * No description
     *
     * @tags sim
     * @name PostSimCompare
     * @summary Compare a reference profile vs one or more profiles
     * @request POST:/sim/compare
     * @response `200` `SimResult` Success
     */
    postSimCompare: (payload: CompareInput, params?: RequestParams) => Promise<HttpResponse<SimResult, any>>;
    /**
     * No description
     *
     * @tags sim
     * @name GetAnnotationScore
     * @summary Get annotation score
     * @request GET:/sim/score
     * @response `200` `SufficiencyOutput` Success
     */
    getAnnotationScore: (
      query?: {
        id?: string[];
        absent_id?: string[];
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<SufficiencyOutput, any>>;
    /**
     * No description
     *
     * @tags sim
     * @name PostAnnotationScore
     * @summary Get annotation score
     * @request POST:/sim/score
     * @response `200` `SufficiencyOutput` Success
     */
    postAnnotationScore: (
      payload: SufficiencyPostInput,
      params?: RequestParams,
    ) => Promise<HttpResponse<SufficiencyOutput, any>>;
    /**
     * No description
     *
     * @tags sim
     * @name GetSimSearch
     * @summary Search for phenotypically similar diseases or model genes
     * @request GET:/sim/search
     * @response `200` `SimResult` Success
     */
    getSimSearch: (
      query?: {
        is_feature_set?: boolean;
        metric?: "phenodigm" | "jaccard" | "simGIC" | "resnik" | "symmetric_resnik";
        id?: string[];
        limit?: number;
        taxon?: string;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<SimResult, any>>;
  };
  variation: {
    /**
     * No description
     *
     * @tags variation/set
     * @name GetVariantSetsCollection
     * @summary Returns list of variant sets
     * @request GET:/variation/set/
     * @response `200` `PageOfVariantSets` Success
     */
    getVariantSetsCollection: (
      query?: {
        page?: number;
        per_page?: 2 | 10 | 20 | 30 | 40 | 50;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<PageOfVariantSets, any>>;
    /**
     * No description
     *
     * @tags variation/set
     * @name PostVariantSetsCollection
     * @summary Creates a new variant set
     * @request POST:/variation/set/
     * @response `200` `void` Success
     */
    postVariantSetsCollection: (payload: VariantSet, params?: RequestParams) => Promise<HttpResponse<void, any>>;
    /**
     * No description
     *
     * @tags variation/set
     * @name GetVariantAnalyze
     * @summary Returns list of matches
     * @request GET:/variation/set/analyze/{id}
     * @response `200` `(Association)[]` Success
     */
    getVariantAnalyze: (id: string, params?: RequestParams) => Promise<HttpResponse<Association[], any>>;
    /**
     * No description
     *
     * @tags variation/set
     * @name GetVariantSetsArchiveCollection
     * @summary Returns list of variant sets from a specified time period
     * @request GET:/variation/set/archive/{year}/{month}/{day}
     * @response `200` `PageOfVariantSets` Success
     */
    getVariantSetsArchiveCollection: (
      year: number,
      month: number,
      day: number,
      query?: {
        page?: number;
        per_page?: 2 | 10 | 20 | 30 | 40 | 50;
      },
      params?: RequestParams,
    ) => Promise<HttpResponse<PageOfVariantSets, any>>;
    /**
     * No description
     *
     * @tags variation/set
     * @name GetVariantSetItem
     * @summary Returns a variant set
     * @request GET:/variation/set/{id}
     * @response `200` `VariantSet` Success
     * @response `404` `void` VariantSet not found.
     */
    getVariantSetItem: (id: string, params?: RequestParams) => Promise<HttpResponse<VariantSet, void>>;
    /**
     * No description
     *
     * @tags variation/set
     * @name DeleteVariantSetItem
     * @summary Deletes variant set
     * @request DELETE:/variation/set/{id}
     * @response `204` `void` VariantSet successfully deleted.
     * @response `404` `void` VariantSet not found.
     */
    deleteVariantSetItem: (id: string, params?: RequestParams) => Promise<HttpResponse<void, void>>;
    /**
     * No description
     *
     * @tags variation/set
     * @name PutVariantSetItem
     * @summary Updates a variant set
     * @request PUT:/variation/set/{id}
     * @response `204` `void` VariantSet successfully updated.
     * @response `404` `void` VariantSet not found.
     */
    putVariantSetItem: (id: string, payload: VariantSet, params?: RequestParams) => Promise<HttpResponse<void, void>>;
  };
}
export {};
