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

export var ContentType;
(function (ContentType) {
  ContentType["Json"] = "application/json";
  ContentType["FormData"] = "multipart/form-data";
  ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
})(ContentType || (ContentType = {}));
export class HttpClient {
  baseUrl = "/api";
  securityData = null;
  securityWorker;
  abortControllers = new Map();
  customFetch = (...fetchParams) => fetch(...fetchParams);
  baseApiParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };
  constructor(apiConfig = {}) {
    Object.assign(this, apiConfig);
  }
  setSecurityData = (data) => {
    this.securityData = data;
  };
  encodeQueryParam(key, value) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }
  addQueryParam(query, key) {
    return this.encodeQueryParam(key, query[key]);
  }
  addArrayQueryParam(query, key) {
    const value = query[key];
    return value.map((v) => this.encodeQueryParam(key, v)).join("&");
  }
  toQueryString(rawQuery) {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&");
  }
  addQueryParams(rawQuery) {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }
  contentFormatters = {
    [ContentType.Json]: (input) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input) => this.toQueryString(input),
  };
  mergeRequestParams(params1, params2) {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }
  createAbortSignal = (cancelToken) => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }
    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };
  abortRequest = (cancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);
    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };
  request = async ({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }) => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;
    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${
        queryString ? `?${queryString}` : ""
      }`,
      {
        ...requestParams,
        headers: {
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
          ...(requestParams.headers || {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response;
      r.data = null;
      r.error = null;
      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });
      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }
      if (!response.ok) throw data;
      return data;
    });
  };
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
export class Api {
  http;
  constructor(http) {
    this.http = http;
  }
  association = {
    /**
     * @description Given two entities (e.g. a particular gene and a particular disease), if these two entities are connected (directly or indirectly), then return the association objects describing the connection.
     *
     * @tags association
     * @name GetAssociationsBetween
     * @summary Returns associations connecting two entities
     * @request GET:/association/between/{subject}/{object}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationsBetween: (object, subject, query, params = {}) =>
      this.http.request({
        path: `/association/between/${subject}/${object}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
      subjectCategory,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/association/find/${subjectCategory}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
      objectCategory,
      subjectCategory,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/association/find/${subjectCategory}/${objectCategory}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags association
     * @name GetAssociationsFrom
     * @summary Returns list of matching associations starting from a given subject (source)
     * @request GET:/association/from/{subject}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationsFrom: (subject, query, params = {}) =>
      this.http.request({
        path: `/association/from/${subject}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags association
     * @name GetAssociationsTo
     * @summary Returns list of matching associations pointing to a given object (target)
     * @request GET:/association/to/{object}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationsTo: (object, query, params = {}) =>
      this.http.request({
        path: `/association/to/${object}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
      associationType,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/association/type/${associationType}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description An association connects, at a minimum, two things, designated subject and object, via some relationship. Associations also include evidence, provenance etc.
     *
     * @tags association
     * @name GetAssociationObject
     * @summary Returns the association with a given identifier
     * @request GET:/association/{id}
     * @response `200` `(AssociationResults)[]` Success
     */
    getAssociationObject: (id, params = {}) =>
      this.http.request({
        path: `/association/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  bioentity = {
    /**
     * No description
     *
     * @tags bioentity
     * @name GetAnatomyGeneAssociations
     * @summary Returns genes associated with a given anatomy
     * @request GET:/bioentity/anatomy/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getAnatomyGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/anatomy/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
    getAnatomyGeneByTaxonAssociations: (taxid, id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/anatomy/${id}/genes/${taxid}`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseDiseaseAssociations
     * @summary Returns diseases associated with a case
     * @request GET:/bioentity/case/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getCaseDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/case/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseGenotypeAssociations
     * @summary Returns genotypes associated with a case
     * @request GET:/bioentity/case/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getCaseGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/case/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseModelAssociations
     * @summary Returns models associated with a case
     * @request GET:/bioentity/case/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getCaseModelAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/case/${id}/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCasePhenotypeAssociations
     * @summary Returns phenotypes associated with a case
     * @request GET:/bioentity/case/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getCasePhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/case/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetCaseVariantAssociations
     * @summary Returns variants associated with a case
     * @request GET:/bioentity/case/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getCaseVariantAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/case/${id}/variants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseCaseAssociations
     * @summary Returns cases associated with a disease
     * @request GET:/bioentity/disease/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getDiseaseCaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/cases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseGeneAssociations
     * @summary Returns genes associated with a disease
     * @request GET:/bioentity/disease/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getDiseaseGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseGenotypeAssociations
     * @summary Returns genotypes associated with a disease
     * @request GET:/bioentity/disease/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getDiseaseGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description In the association object returned, the subject will be the disease, and the object will be the model. The model may be a gene or genetic element. If the query disease is a general class, the association subject may be to a specific disease. In some cases the association will be *direct*, for example if a paper asserts a genotype is a model of a disease. In other cases, the association will be *indirect*, for example, chaining over orthology. In these cases the chain will be reflected in the *evidence graph* * TODO: provide hook into owlsim for dynamic computation of models by similarity
     *
     * @tags bioentity
     * @name GetDiseaseModelAssociations
     * @summary Returns associations to models of the disease
     * @request GET:/bioentity/disease/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getDiseaseModelAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
    getDiseaseModelTaxonAssociations: (taxon, id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/models/${taxon}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseasePathwayAssociations
     * @summary Returns pathways associated with a disease
     * @request GET:/bioentity/disease/{id}/pathways
     * @response `200` `AssociationResults` Success
     */
    getDiseasePathwayAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/pathways`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseasePhenotypeAssociations
     * @summary Returns phenotypes associated with disease
     * @request GET:/bioentity/disease/{id}/phenotypes
     * @response `200` `D2PAssociationResults` Success
     */
    getDiseasePhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseasePublicationAssociations
     * @summary Returns publications associated with a disease
     * @request GET:/bioentity/disease/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getDiseasePublicationAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/publications`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description e.g. drugs or small molecules used to treat
     *
     * @tags bioentity
     * @name GetDiseaseSubstanceAssociations
     * @summary Returns substances associated with a disease
     * @request GET:/bioentity/disease/{id}/treatment
     * @response `200` `void` Success
     */
    getDiseaseSubstanceAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/treatment`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetDiseaseVariantAssociations
     * @summary Returns variants associated with a disease
     * @request GET:/bioentity/disease/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getDiseaseVariantAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/disease/${id}/variants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionAssociations
     * @summary Returns annotations associated to a function term
     * @request GET:/bioentity/function/{id}
     * @response `200` `void` Success
     */
    getFunctionAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/function/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionGeneAssociations
     * @summary Returns genes associated to a GO term
     * @request GET:/bioentity/function/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getFunctionGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/function/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionPublicationAssociations
     * @summary Returns publications associated to a GO term
     * @request GET:/bioentity/function/{id}/publications
     * @response `200` `void` Success
     */
    getFunctionPublicationAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/function/${id}/publications`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetFunctionTaxonAssociations
     * @summary Returns taxons associated to a GO term
     * @request GET:/bioentity/function/{id}/taxons
     * @response `200` `void` Success
     */
    getFunctionTaxonAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/function/${id}/taxons`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneAnatomyAssociations
     * @summary Returns anatomical entities associated with a gene
     * @request GET:/bioentity/gene/{id}/anatomy
     * @response `200` `AssociationResults` Success
     */
    getGeneAnatomyAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/anatomy`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneCaseAssociations
     * @summary Returns cases associated with a gene
     * @request GET:/bioentity/gene/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getGeneCaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/cases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneDiseaseAssociations
     * @summary Returns diseases associated with gene
     * @request GET:/bioentity/gene/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getGeneDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneExpressionAssociations
     * @summary Returns expression events for a gene
     * @request GET:/bioentity/gene/{id}/expression/anatomy
     * @response `200` `AssociationResults` Success
     */
    getGeneExpressionAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/expression/anatomy`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description IMPLEMENTATION DETAILS ---------------------- Note: currently this is implemented as a query to the GO/AmiGO solr instance. This directly supports IDs such as: - ZFIN e.g. ZFIN:ZDB-GENE-050417-357 Note that the AmiGO GOlr natively stores MGI annotations to MGI:MGI:nn. However, the standard for biolink is MGI:nnnn, so you should use this (will be transparently mapped to legacy ID) Additionally, for some species such as Human, GO has the annotation attached to the UniProt ID. Again, this should be transparently handled; e.g. you can use NCBIGene:6469, and this will be mapped behind the scenes for querying.
     *
     * @tags bioentity
     * @name GetGeneFunctionAssociations
     * @summary Returns function associations for a gene
     * @request GET:/bioentity/gene/{id}/function
     * @response `200` `AssociationResults` Success
     */
    getGeneFunctionAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/function`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneGenotypeAssociations
     * @summary Returns genotypes associated with a gene
     * @request GET:/bioentity/gene/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getGeneGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneHomologAssociations
     * @summary Returns homologs for a gene
     * @request GET:/bioentity/gene/{id}/homologs
     * @response `200` `AssociationResults` Success
     */
    getGeneHomologAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/homologs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneInteractions
     * @summary Returns interactions for a gene
     * @request GET:/bioentity/gene/{id}/interactions
     * @response `200` `AssociationResults` Success
     */
    getGeneInteractions: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/interactions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneModelAssociations
     * @summary Returns models associated with a gene
     * @request GET:/bioentity/gene/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getGeneModelAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneOrthologDiseaseAssociations
     * @summary Return diseases associated with orthologs of a gene
     * @request GET:/bioentity/gene/{id}/ortholog/diseases
     * @response `200` `AssociationResults` Success
     */
    getGeneOrthologDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/ortholog/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneOrthologPhenotypeAssociations
     * @summary Return phenotypes associated with orthologs for a gene
     * @request GET:/bioentity/gene/{id}/ortholog/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getGeneOrthologPhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/ortholog/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenePathwayAssociations
     * @summary Returns pathways associated with gene
     * @request GET:/bioentity/gene/{id}/pathways
     * @response `200` `AssociationResults` Success
     */
    getGenePathwayAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/pathways`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenePhenotypeAssociations
     * @summary Returns phenotypes associated with gene
     * @request GET:/bioentity/gene/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getGenePhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenePublicationAssociations
     * @summary Returns publications associated with a gene
     * @request GET:/bioentity/gene/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getGenePublicationAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/publications`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGeneVariantAssociations
     * @summary Returns variants associated with a gene
     * @request GET:/bioentity/gene/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getGeneVariantAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/gene/${id}/variants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeCaseAssociations
     * @summary Returns cases associated with a genotype
     * @request GET:/bioentity/genotype/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getGenotypeCaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/cases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeDiseaseAssociations
     * @summary Returns diseases associated with a genotype
     * @request GET:/bioentity/genotype/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getGenotypeDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeGeneAssociations
     * @summary Returns genes associated with a genotype
     * @request GET:/bioentity/genotype/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getGenotypeGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description Genotypes may be related to one another according to the GENO model
     *
     * @tags bioentity
     * @name GetGenotypeGenotypeAssociations
     * @summary Returns genotypes-genotype associations
     * @request GET:/bioentity/genotype/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getGenotypeGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeModelAssociations
     * @summary Returns models associated with a genotype
     * @request GET:/bioentity/genotype/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getGenotypeModelAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypePhenotypeAssociations
     * @summary Returns phenotypes associated with a genotype
     * @request GET:/bioentity/genotype/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getGenotypePhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypePublicationAssociations
     * @summary Returns publications associated with a genotype
     * @request GET:/bioentity/genotype/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getGenotypePublicationAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/publications`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenotypeVariantAssociations
     * @summary Returns genotypes-variant associations
     * @request GET:/bioentity/genotype/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getGenotypeVariantAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/genotype/${id}/variants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
    getGotermGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/goterm/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelCaseAssociations
     * @summary Returns cases associated with a model
     * @request GET:/bioentity/model/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getModelCaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/model/${id}/cases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelDiseaseAssociations
     * @summary Returns diseases associated with a model
     * @request GET:/bioentity/model/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getModelDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/model/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelGeneAssociations
     * @summary Returns genes associated with a model
     * @request GET:/bioentity/model/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getModelGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/model/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelGenotypeAssociations
     * @summary Returns genotypes associated with a model
     * @request GET:/bioentity/model/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getModelGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/model/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelPhenotypeAssociations
     * @summary Returns phenotypes associated with a model
     * @request GET:/bioentity/model/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getModelPhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/model/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelPublicationAssociations
     * @summary Returns publications associated with a model
     * @request GET:/bioentity/model/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getModelPublicationAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/model/${id}/publications`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetModelVariantAssociations
     * @summary Returns variants associated with a model
     * @request GET:/bioentity/model/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getModelVariantAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/model/${id}/variants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPathwayDiseaseAssociations
     * @summary Returns diseases associated with a pathway
     * @request GET:/bioentity/pathway/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getPathwayDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/pathway/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPathwayGeneAssociations
     * @summary Returns genes associated with a pathway
     * @request GET:/bioentity/pathway/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getPathwayGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/pathway/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPathwayPhenotypeAssociations
     * @summary Returns phenotypes associated with a pathway
     * @request GET:/bioentity/pathway/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getPathwayPhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/pathway/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description Example IDs: * MP:0008521 abnormal Bowman membrane
     *
     * @tags bioentity
     * @name GetPhenotypeAnatomyAssociations
     * @summary Returns anatomical entities associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/anatomy
     * @response `200` `(NamedObject)[]` Success
     */
    getPhenotypeAnatomyAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/anatomy`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeCaseAssociations
     * @summary Returns cases associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeCaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/cases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeDiseaseAssociations
     * @summary Returns diseases associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/diseases
     * @response `200` `D2PAssociationResults` Success
     */
    getPhenotypeDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
    getPhenotypeGeneByTaxonAssociations: (taxid, id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/gene/${taxid}/ids`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeGeneAssociations
     * @summary Returns genes associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeGenotypeAssociations
     * @summary Returns genotypes associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypePathwayAssociations
     * @summary Returns pathways associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/pathways
     * @response `200` `AssociationResults` Success
     */
    getPhenotypePathwayAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/pathways`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypePublicationAssociations
     * @summary Returns publications associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getPhenotypePublicationAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/publications`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPhenotypeVariantAssociations
     * @summary Returns variants associated with a phenotype
     * @request GET:/bioentity/phenotype/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getPhenotypeVariantAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/phenotype/${id}/variants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationDiseaseAssociations
     * @summary Returns diseases associated with a publication
     * @request GET:/bioentity/publication/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getPublicationDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/publication/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationGeneAssociations
     * @summary Returns genes associated with a publication
     * @request GET:/bioentity/publication/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getPublicationGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/publication/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationGenotypeAssociations
     * @summary Returns genotypes associated with a publication
     * @request GET:/bioentity/publication/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getPublicationGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/publication/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationModelAssociations
     * @summary Returns models associated with a publication
     * @request GET:/bioentity/publication/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getPublicationModelAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/publication/${id}/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationPhenotypeAssociations
     * @summary Returns phenotypes associated with a publication
     * @request GET:/bioentity/publication/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getPublicationPhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/publication/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetPublicationVariantAssociations
     * @summary Returns variants associated with a publication
     * @request GET:/bioentity/publication/{id}/variants
     * @response `200` `AssociationResults` Success
     */
    getPublicationVariantAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/publication/${id}/variants`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description Examples relationships: * substance is a metabolite of a process * substance is synthesized by a process * substance is modified by an activity * substance elicits a response program/pathway * substance is transported by activity or pathway For example, CHEBI:40036 (amitrole)
     *
     * @tags bioentity
     * @name GetSubstanceParticipantInAssociations
     * @summary Returns associations between an activity and process and the specified substance
     * @request GET:/bioentity/substance/{id}/participant_in
     * @response `200` `(Association)[]` Success
     */
    getSubstanceParticipantInAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/substance/${id}/participant_in`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description Roles may be human-oriented (e.g. pesticide) or molecular (e.g. enzyme inhibitor)
     *
     * @tags bioentity
     * @name GetSubstanceRoleAssociations
     * @summary Returns associations between given drug and roles
     * @request GET:/bioentity/substance/{id}/roles
     * @response `200` `(Association)[]` Success
     */
    getSubstanceRoleAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/substance/${id}/roles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description e.g. drugs or small molecules used to treat
     *
     * @tags bioentity
     * @name GetSubstanceTreatsAssociations
     * @summary Returns substances associated with a disease
     * @request GET:/bioentity/substance/{id}/treats
     * @response `200` `void` Success
     */
    getSubstanceTreatsAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/substance/${id}/treats`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantCaseAssociations
     * @summary Returns cases associated with a variant
     * @request GET:/bioentity/variant/{id}/cases
     * @response `200` `AssociationResults` Success
     */
    getVariantCaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/variant/${id}/cases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantDiseaseAssociations
     * @summary Returns diseases associated with a variant
     * @request GET:/bioentity/variant/{id}/diseases
     * @response `200` `AssociationResults` Success
     */
    getVariantDiseaseAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/variant/${id}/diseases`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantGeneAssociations
     * @summary Returns genes associated with a variant
     * @request GET:/bioentity/variant/{id}/genes
     * @response `200` `AssociationResults` Success
     */
    getVariantGeneAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/variant/${id}/genes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantGenotypeAssociations
     * @summary Returns genotypes associated with a variant
     * @request GET:/bioentity/variant/{id}/genotypes
     * @response `200` `AssociationResults` Success
     */
    getVariantGenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/variant/${id}/genotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantModelAssociations
     * @summary Returns models associated with a variant
     * @request GET:/bioentity/variant/{id}/models
     * @response `200` `AssociationResults` Success
     */
    getVariantModelAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/variant/${id}/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantPhenotypeAssociations
     * @summary Returns phenotypes associated with a variant
     * @request GET:/bioentity/variant/{id}/phenotypes
     * @response `200` `AssociationResults` Success
     */
    getVariantPhenotypeAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/variant/${id}/phenotypes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetVariantPublicationAssociations
     * @summary Returns publications associated with a variant
     * @request GET:/bioentity/variant/{id}/publications
     * @response `200` `AssociationResults` Success
     */
    getVariantPublicationAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/variant/${id}/publications`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenericObject
     * @summary Returns basic info on object of any type
     * @request GET:/bioentity/{id}
     * @response `200` `BioObject` Success
     */
    getGenericObject: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenericAssociations
     * @summary Returns associations for an entity regardless of the type
     * @request GET:/bioentity/{id}/associations
     * @response `200` `AssociationResults` Success
     */
    getGenericAssociations: (id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/${id}/associations`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentity
     * @name GetGenericObjectByType
     * @summary Return basic info on an object for a given type
     * @request GET:/bioentity/{type}/{id}
     * @response `200` `void` Success
     */
    getGenericObjectByType: (type, id, query, params = {}) =>
      this.http.request({
        path: `/bioentity/${type}/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  bioentityset = {
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetEntitySetAssociations
     * @summary Returns compact associations for a given input set
     * @request GET:/bioentityset/associations
     * @response `200` `(AssociationResults)[]` Success
     */
    getEntitySetAssociations: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/associations`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetEntitySetSummary
     * @summary Summary statistics for objects associated
     * @request GET:/bioentityset/descriptor/counts
     * @response `200` `void` Success
     */
    getEntitySetSummary: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/descriptor/counts`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetEntitySetGraphResource
     * @summary TODO Graph object spanning all entities
     * @request GET:/bioentityset/graph
     * @response `200` `void` Success
     */
    getEntitySetGraphResource: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/graph`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentityset/homologs
     * @name GetEntitySetHomologs
     * @summary Returns homology associations for a given input set of genes
     * @request GET:/bioentityset/homologs/
     * @response `200` `(AssociationResults)[]` Success
     */
    getEntitySetHomologs: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/homologs/`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentityset
     * @name GetOverRepresentation
     * @summary Summary statistics for objects associated
     * @request GET:/bioentityset/overrepresentation
     * @response `200` `void` Success
     */
    getOverRepresentation: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/overrepresentation`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentityset/slimmer
     * @name GetEntitySetAnatomySlimmer
     * @summary For a given gene(s), summarize its annotations over a defined set of slim
     * @request GET:/bioentityset/slimmer/anatomy
     * @response `200` `void` Success
     */
    getEntitySetAnatomySlimmer: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/slimmer/anatomy`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentityset/slimmer
     * @name GetEntitySetFunctionSlimmer
     * @summary For a given gene(s), summarize its annotations over a defined set of slim
     * @request GET:/bioentityset/slimmer/function
     * @response `200` `void` Success
     */
    getEntitySetFunctionSlimmer: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/slimmer/function`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags bioentityset/slimmer
     * @name GetEntitySetPhenotypeSlimmer
     * @summary For a given gene(s), summarize its annotations over a defined set of slim
     * @request GET:/bioentityset/slimmer/phenotype
     * @response `200` `void` Success
     */
    getEntitySetPhenotypeSlimmer: (query, params = {}) =>
      this.http.request({
        path: `/bioentityset/slimmer/phenotype`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  cam = {
    /**
     * No description
     *
     * @tags cam
     * @name GetActivityCollection
     * @summary Returns list of models
     * @request GET:/cam/activity
     * @response `200` `void` Success
     */
    getActivityCollection: (query, params = {}) =>
      this.http.request({
        path: `/cam/activity`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetInstanceObject
     * @summary Returns list of matches
     * @request GET:/cam/instance/{id}
     * @response `200` `(Association)[]` Success
     */
    getInstanceObject: (id, query, params = {}) =>
      this.http.request({
        path: `/cam/instance/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetModelInstances
     * @summary Returns list of all instances
     * @request GET:/cam/instances
     * @response `200` `void` Success
     */
    getModelInstances: (params = {}) =>
      this.http.request({
        path: `/cam/instances`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetModelCollection
     * @summary Returns list of ALL models
     * @request GET:/cam/model
     * @response `200` `void` Success
     */
    getModelCollection: (params = {}) =>
      this.http.request({
        path: `/cam/model`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetModelContributors
     * @summary Returns list of all contributors across all models
     * @request GET:/cam/model/contributors
     * @response `200` `void` Success
     */
    getModelContributors: (params = {}) =>
      this.http.request({
        path: `/cam/model/contributors`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetModelProperties
     * @summary Returns list of all properties used across all models
     * @request GET:/cam/model/properties
     * @response `200` `void` Success
     */
    getModelProperties: (query, params = {}) =>
      this.http.request({
        path: `/cam/model/properties`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetModelPropertyValues
     * @summary Returns list property-values for all models
     * @request GET:/cam/model/property_values
     * @response `200` `void` Success
     */
    getModelPropertyValues: (query, params = {}) =>
      this.http.request({
        path: `/cam/model/property_values`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetModelQuery
     * @summary Returns list of models matching query
     * @request GET:/cam/model/query
     * @response `200` `void` Success
     */
    getModelQuery: (query, params = {}) =>
      this.http.request({
        path: `/cam/model/query`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetModelObject
     * @summary Returns a complete model
     * @request GET:/cam/model/{id}
     * @response `200` `void` Success
     */
    getModelObject: (id, params = {}) =>
      this.http.request({
        path: `/cam/model/${id}`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags cam
     * @name GetPhysicalInteraction
     * @summary Returns list of models
     * @request GET:/cam/physical_interaction
     * @response `200` `void` Success
     */
    getPhysicalInteraction: (query, params = {}) =>
      this.http.request({
        path: `/cam/physical_interaction`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  evidence = {
    /**
     * @description Note that every association is assumed to have a unique ID
     *
     * @tags evidence/graph
     * @name GetEvidenceGraphObject
     * @summary Returns evidence graph object for a given association
     * @request GET:/evidence/graph/{id}
     * @response `200` `(Graph)[]` Success
     */
    getEvidenceGraphObject: (id, params = {}) =>
      this.http.request({
        path: `/evidence/graph/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * @description Note that every association is assumed to have a unique ID
     *
     * @tags evidence/graph
     * @name GetEvidenceGraphTable
     * @summary Returns evidence as a association_results object given an association
     * @request GET:/evidence/graph/{id}/table
     * @response `200` `(AssociationResults)[]` Success
     */
    getEvidenceGraphTable: (id, query, params = {}) =>
      this.http.request({
        path: `/evidence/graph/${id}/table`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  genome = {
    /**
     * No description
     *
     * @tags genome/features
     * @name GetFeaturesWithinResource
     * @summary Returns list of matches
     * @request GET:/genome/features/within/{build}/{reference}/{begin}/{end}
     * @response `200` `(SequenceFeature)[]` Success
     */
    getFeaturesWithinResource: (build, reference, begin, end, params = {}) =>
      this.http.request({
        path: `/genome/features/within/${build}/${reference}/${begin}/${end}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  graph = {
    /**
     * No description
     *
     * @tags graph
     * @name GetEdgeResource
     * @summary Returns edges emanating from a given node
     * @request GET:/graph/edges/from/{id}
     * @response `200` `(Graph)[]` Success
     */
    getEdgeResource: (id, query, params = {}) =>
      this.http.request({
        path: `/graph/edges/from/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * @description A node is an abstract representation of some kind of entity. The entity may be a physical thing such as a patient, a molecular entity such as a gene or protein, or a conceptual entity such as a class from an ontology.
     *
     * @tags graph
     * @name GetNodeResource
     * @summary Returns a graph node
     * @request GET:/graph/node/{id}
     * @response `200` `(BioObject)[]` Success
     */
    getNodeResource: (id, params = {}) =>
      this.http.request({
        path: `/graph/node/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  identifier = {
    /**
     * No description
     *
     * @tags identifier/mapper
     * @name GetIdentifierMapper
     * @summary TODO maps a list of identifiers from a source to a target
     * @request GET:/identifier/mapper/{source}/{target}/
     * @response `200` `(Association)[]` Success
     */
    getIdentifierMapper: (source, target, params = {}) =>
      this.http.request({
        path: `/identifier/mapper/${source}/${target}/`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags identifier/prefixes
     * @name GetPrefixCollection
     * @summary Returns list of prefixes
     * @request GET:/identifier/prefixes/
     * @response `200` `void` Success
     */
    getPrefixCollection: (params = {}) =>
      this.http.request({
        path: `/identifier/prefixes/`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags identifier/prefixes
     * @name GetPrefixContract
     * @summary Returns contracted URI
     * @request GET:/identifier/prefixes/contract/{uri}
     * @response `200` `void` Success
     */
    getPrefixContract: (uri, params = {}) =>
      this.http.request({
        path: `/identifier/prefixes/contract/${uri}`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags identifier/prefixes
     * @name GetPrefixExpand
     * @summary Returns expanded URI
     * @request GET:/identifier/prefixes/expand/{id}
     * @response `200` `void` Success
     */
    getPrefixExpand: (id, params = {}) =>
      this.http.request({
        path: `/identifier/prefixes/expand/${id}`,
        method: "GET",
        ...params,
      }),
  };
  individual = {
    /**
     * No description
     *
     * @tags individual
     * @name GetPedigree
     * @summary Returns list of matches
     * @request GET:/individual/pedigree/{id}
     * @response `200` `(Association)[]` Success
     */
    getPedigree: (id, params = {}) =>
      this.http.request({
        path: `/individual/pedigree/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags individual
     * @name GetIndividual
     * @summary Returns list of matches
     * @request GET:/individual/{id}
     * @response `200` `(Association)[]` Success
     */
    getIndividual: (id, params = {}) =>
      this.http.request({
        path: `/individual/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  mart = {
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
      taxon,
      objectCategory,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/mart/case/${objectCategory}/${taxon}`,
        method: "GET",
        query: query,
        ...params,
      }),
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
      taxon,
      objectCategory,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/mart/disease/${objectCategory}/${taxon}`,
        method: "GET",
        query: query,
        ...params,
      }),
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
      taxon,
      objectCategory,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/mart/gene/${objectCategory}/${taxon}`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags mart
     * @name GetMartOrthologAssociationsResource
     * @summary Bulk download of orthologs
     * @request GET:/mart/ortholog/{taxon1}/{taxon2}
     * @response `200` `void` Success
     */
    getMartOrthologAssociationsResource: (taxon2, taxon1, params = {}) =>
      this.http.request({
        path: `/mart/ortholog/${taxon1}/${taxon2}`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags mart
     * @name GetMartParalogAssociationsResource
     * @summary Bulk download of paralogs
     * @request GET:/mart/paralog/{taxon1}/{taxon2}
     * @response `200` `void` Success
     */
    getMartParalogAssociationsResource: (taxon2, taxon1, params = {}) =>
      this.http.request({
        path: `/mart/paralog/${taxon1}/${taxon2}`,
        method: "GET",
        ...params,
      }),
  };
  metadata = {
    /**
     * No description
     *
     * @tags metadata
     * @name GetMetadataForDatasets
     * @summary Get metadata for all datasets from SciGraph
     * @request GET:/metadata/datasets
     * @response `200` `void` Success
     */
    getMetadataForDatasets: (params = {}) =>
      this.http.request({
        path: `/metadata/datasets`,
        method: "GET",
        ...params,
      }),
  };
  mme = {
    /**
     * No description
     *
     * @tags mme
     * @name PostDiseaseMme
     * @summary Match a patient to diseases based on their phenotypes
     * @request POST:/mme/disease
     * @response `200` `void` Success
     */
    postDiseaseMme: (payload, params = {}) =>
      this.http.request({
        path: `/mme/disease`,
        method: "POST",
        body: payload,
        ...params,
      }),
    /**
     * No description
     *
     * @tags mme
     * @name PostFlyMme
     * @summary Match a patient to fruit fly genes based on similar phenotypes
     * @request POST:/mme/fly
     * @response `200` `void` Success
     */
    postFlyMme: (payload, params = {}) =>
      this.http.request({
        path: `/mme/fly`,
        method: "POST",
        body: payload,
        ...params,
      }),
    /**
     * No description
     *
     * @tags mme
     * @name PostMouseMme
     * @summary Match a patient to mouse genes based on similar phenotypes
     * @request POST:/mme/mouse
     * @response `200` `void` Success
     */
    postMouseMme: (payload, params = {}) =>
      this.http.request({
        path: `/mme/mouse`,
        method: "POST",
        body: payload,
        ...params,
      }),
    /**
     * No description
     *
     * @tags mme
     * @name PostNematodeMme
     * @summary Match a patient to nematode genes based on similar phenotypes
     * @request POST:/mme/nematode
     * @response `200` `void` Success
     */
    postNematodeMme: (payload, params = {}) =>
      this.http.request({
        path: `/mme/nematode`,
        method: "POST",
        body: payload,
        ...params,
      }),
    /**
     * No description
     *
     * @tags mme
     * @name PostZebrafishMme
     * @summary Match a patient to zebrafish genes based on similar phenotypes
     * @request POST:/mme/zebrafish
     * @response `200` `void` Success
     */
    postZebrafishMme: (payload, params = {}) =>
      this.http.request({
        path: `/mme/zebrafish`,
        method: "POST",
        body: payload,
        ...params,
      }),
  };
  nlp = {
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name GetAnnotate
     * @summary Annotate a given text using SciGraph annotator
     * @request GET:/nlp/annotate/
     * @response `200` `void` Success
     */
    getAnnotate: (query, params = {}) =>
      this.http.request({
        path: `/nlp/annotate/`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name PostAnnotate
     * @summary Annotate a given text using SciGraph annotator
     * @request POST:/nlp/annotate/
     * @response `200` `void` Success
     */
    postAnnotate: (query, params = {}) =>
      this.http.request({
        path: `/nlp/annotate/`,
        method: "POST",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name GetAnnotateEntities
     * @summary Annotate a given content using SciGraph annotator and get all entities from content
     * @request GET:/nlp/annotate/entities
     * @response `200` `EntityAnnotationResult` Success
     */
    getAnnotateEntities: (query, params = {}) =>
      this.http.request({
        path: `/nlp/annotate/entities`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags nlp/annotate
     * @name PostAnnotateEntities
     * @summary Annotate a given content using SciGraph annotator and get all entities from content
     * @request POST:/nlp/annotate/entities
     * @response `200` `EntityAnnotationResult` Success
     */
    postAnnotateEntities: (query, params = {}) =>
      this.http.request({
        path: `/nlp/annotate/entities`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  ontol = {
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
      subjectCategory,
      objectCategory,
      subjectTaxon,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/ontol/information_content/${subjectCategory}/${objectCategory}/${subjectTaxon}`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontol/labeler
     * @name GetOntolLabelerResource
     * @summary Fetches a map from CURIEs/IDs to labels
     * @request GET:/ontol/labeler/
     * @response `200` `void` Success
     */
    getOntolLabelerResource: (query, params = {}) =>
      this.http.request({
        path: `/ontol/labeler/`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontol
     * @name GetExtractOntologySubgraphResource
     * @summary Extract a subgraph from an ontology
     * @request GET:/ontol/subgraph/{ontology}/{node}
     * @response `200` `void` Success
     */
    getExtractOntologySubgraphResource: (node, ontology, query, params = {}) =>
      this.http.request({
        path: `/ontol/subgraph/${ontology}/${node}`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontol
     * @name PostExtractOntologySubgraphResource
     * @summary Extract a subgraph from an ontology
     * @request POST:/ontol/subgraph/{ontology}/{node}
     * @response `200` `void` Success
     */
    postExtractOntologySubgraphResource: (node, ontology, query, params = {}) =>
      this.http.request({
        path: `/ontol/subgraph/${ontology}/${node}`,
        method: "POST",
        query: query,
        ...params,
      }),
  };
  ontology = {
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermsSharedAncestor
     * @summary Returns the ancestor ontology terms shared by two ontology terms
     * @request GET:/ontology/shared/{subject}/{object}
     * @response `200` `void` Success
     */
    getOntologyTermsSharedAncestor: (subject, object, params = {}) =>
      this.http.request({
        path: `/ontology/shared/${subject}/${object}`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologySubset
     * @summary Returns meta data of an ontology subset (slim)
     * @request GET:/ontology/subset/{id}
     * @response `200` `void` Success
     */
    getOntologySubset: (id, params = {}) =>
      this.http.request({
        path: `/ontology/subset/${id}`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTerm
     * @summary Returns meta data of an ontology term
     * @request GET:/ontology/term/{id}
     * @response `200` `void` Success
     */
    getOntologyTerm: (id, params = {}) =>
      this.http.request({
        path: `/ontology/term/${id}`,
        method: "GET",
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermGraph
     * @summary Returns graph of an ontology term
     * @request GET:/ontology/term/{id}/graph
     * @response `200` `void` Success
     */
    getOntologyTermGraph: (id, query, params = {}) =>
      this.http.request({
        path: `/ontology/term/${id}/graph`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermSubgraph
     * @summary Extract a subgraph from an ontology term
     * @request GET:/ontology/term/{id}/subgraph
     * @response `200` `void` Success
     */
    getOntologyTermSubgraph: (id, query, params = {}) =>
      this.http.request({
        path: `/ontology/term/${id}/subgraph`,
        method: "GET",
        query: query,
        ...params,
      }),
    /**
     * No description
     *
     * @tags ontology
     * @name GetOntologyTermSubsets
     * @summary Returns subsets (slims) associated to an ontology term
     * @request GET:/ontology/term/{id}/subsets
     * @response `200` `void` Success
     */
    getOntologyTermSubsets: (id, params = {}) =>
      this.http.request({
        path: `/ontology/term/${id}/subsets`,
        method: "GET",
        ...params,
      }),
  };
  owl = {
    /**
     * No description
     *
     * @tags owl/ontology
     * @name GetDlQuery
     * @summary Placeholder - use OWLery for now
     * @request GET:/owl/ontology/dlquery/{query}
     * @response `200` `(Association)[]` Success
     */
    getDlQuery: (query, params = {}) =>
      this.http.request({
        path: `/owl/ontology/dlquery/${query}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags owl/ontology
     * @name GetSparqlQuery
     * @summary Placeholder - use direct SPARQL endpoint for now
     * @request GET:/owl/ontology/sparql/{query}
     * @response `200` `(Association)[]` Success
     */
    getSparqlQuery: (query, params = {}) =>
      this.http.request({
        path: `/owl/ontology/sparql/${query}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  pair = {
    /**
     * No description
     *
     * @tags pair/sim
     * @name GetPairSimJaccardResource
     * @summary Get pairwise similarity
     * @request GET:/pair/sim/jaccard/{id1}/{id2}
     * @response `200` `void` Success
     */
    getPairSimJaccardResource: (id2, id1, query, params = {}) =>
      this.http.request({
        path: `/pair/sim/jaccard/${id1}/${id2}`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  relation = {
    /**
     * No description
     *
     * @tags relation/usage
     * @name GetRelationUsageResource
     * @summary All relations used plus count of associations
     * @request GET:/relation/usage/
     * @response `200` `(AssociationResults)[]` Success
     */
    getRelationUsageResource: (query, params = {}) =>
      this.http.request({
        path: `/relation/usage/`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
      subjectCategory,
      objectCategory,
      query,
      params = {}
    ) =>
      this.http.request({
        path: `/relation/usage/between/${subjectCategory}/${objectCategory}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags relation/usage
     * @name GetRelationUsagePivotResource
     * @summary Relation usage count for all subj x obj category combinations
     * @request GET:/relation/usage/pivot
     * @response `200` `(AssociationResults)[]` Success
     */
    getRelationUsagePivotResource: (query, params = {}) =>
      this.http.request({
        path: `/relation/usage/pivot`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags relation/usage
     * @name GetRelationUsagePivotLabelResource
     * @summary Relation usage count for all subj x obj category combinations, showing label
     * @request GET:/relation/usage/pivot/label
     * @response `200` `(AssociationResults)[]` Success
     */
    getRelationUsagePivotLabelResource: (query, params = {}) =>
      this.http.request({
        path: `/relation/usage/pivot/label`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  search = {
    /**
     * No description
     *
     * @tags search
     * @name GetAutocomplete
     * @summary Returns list of matching concepts or entities using lexical search
     * @request GET:/search/entity/autocomplete/{term}
     * @response `200` `AutocompleteResults` Success
     */
    getAutocomplete: (term, query, params = {}) =>
      this.http.request({
        path: `/search/entity/autocomplete/${term}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags search
     * @name GetSearchHpoEntities
     * @summary Returns list of matching concepts or entities using lexical search
     * @request GET:/search/entity/hpo-pl/{term}
     * @response `200` `LayResults` Success
     */
    getSearchHpoEntities: (term, query, params = {}) =>
      this.http.request({
        path: `/search/entity/hpo-pl/${term}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags search
     * @name GetSearchEntities
     * @summary Returns list of matching concepts or entities using lexical search
     * @request GET:/search/entity/{term}
     * @response `200` `SearchResult` Success
     */
    getSearchEntities: (term, query, params = {}) =>
      this.http.request({
        path: `/search/entity/${term}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  sim = {
    /**
     * No description
     *
     * @tags sim
     * @name GetSimCompare
     * @summary Compare a reference profile vs one profiles
     * @request GET:/sim/compare
     * @response `200` `SimResult` Success
     */
    getSimCompare: (query, params = {}) =>
      this.http.request({
        path: `/sim/compare`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags sim
     * @name PostSimCompare
     * @summary Compare a reference profile vs one or more profiles
     * @request POST:/sim/compare
     * @response `200` `SimResult` Success
     */
    postSimCompare: (payload, params = {}) =>
      this.http.request({
        path: `/sim/compare`,
        method: "POST",
        body: payload,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags sim
     * @name GetAnnotationScore
     * @summary Get annotation score
     * @request GET:/sim/score
     * @response `200` `SufficiencyOutput` Success
     */
    getAnnotationScore: (query, params = {}) =>
      this.http.request({
        path: `/sim/score`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags sim
     * @name PostAnnotationScore
     * @summary Get annotation score
     * @request POST:/sim/score
     * @response `200` `SufficiencyOutput` Success
     */
    postAnnotationScore: (payload, params = {}) =>
      this.http.request({
        path: `/sim/score`,
        method: "POST",
        body: payload,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags sim
     * @name GetSimSearch
     * @summary Search for phenotypically similar diseases or model genes
     * @request GET:/sim/search
     * @response `200` `SimResult` Success
     */
    getSimSearch: (query, params = {}) =>
      this.http.request({
        path: `/sim/search`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  variation = {
    /**
     * No description
     *
     * @tags variation/set
     * @name GetVariantSetsCollection
     * @summary Returns list of variant sets
     * @request GET:/variation/set/
     * @response `200` `PageOfVariantSets` Success
     */
    getVariantSetsCollection: (query, params = {}) =>
      this.http.request({
        path: `/variation/set/`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags variation/set
     * @name PostVariantSetsCollection
     * @summary Creates a new variant set
     * @request POST:/variation/set/
     * @response `200` `void` Success
     */
    postVariantSetsCollection: (payload, params = {}) =>
      this.http.request({
        path: `/variation/set/`,
        method: "POST",
        body: payload,
        ...params,
      }),
    /**
     * No description
     *
     * @tags variation/set
     * @name GetVariantAnalyze
     * @summary Returns list of matches
     * @request GET:/variation/set/analyze/{id}
     * @response `200` `(Association)[]` Success
     */
    getVariantAnalyze: (id, params = {}) =>
      this.http.request({
        path: `/variation/set/analyze/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
    /**
     * No description
     *
     * @tags variation/set
     * @name GetVariantSetsArchiveCollection
     * @summary Returns list of variant sets from a specified time period
     * @request GET:/variation/set/archive/{year}/{month}/{day}
     * @response `200` `PageOfVariantSets` Success
     */
    getVariantSetsArchiveCollection: (year, month, day, query, params = {}) =>
      this.http.request({
        path: `/variation/set/archive/${year}/${month}/${day}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
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
    getVariantSetItem: (id, params = {}) =>
      this.http.request({
        path: `/variation/set/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
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
    deleteVariantSetItem: (id, params = {}) =>
      this.http.request({
        path: `/variation/set/${id}`,
        method: "DELETE",
        ...params,
      }),
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
    putVariantSetItem: (id, payload, params = {}) =>
      this.http.request({
        path: `/variation/set/${id}`,
        method: "PUT",
        body: payload,
        ...params,
      }),
  };
}
