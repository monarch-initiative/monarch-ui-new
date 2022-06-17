import { mapValues } from "lodash";
import { Params } from ".";
import { Options } from "@/components/AppSelectMulti.d";
import { labelToId } from "./taxons";
import { renameKey } from "./../util/object";

/** format of facet counts returned from biolink */
export type Facets = Record<string, Record<string, number>>;

/** set of filters compatible with select options list */
export type Filters = Record<string, Options> | null;

/** simplified filter format for passing to api funcs */
export type Query = Record<string, Array<string>>;

/** convert backend facets into filters (set of options) compatible with select components */
export const facetsToFilters = (facets: Facets): Filters => {
  const filters: Filters = {};
  for (const [name, facet] of Object.entries(facets)) {
    filters[name] = [];
    for (const [id, count] of Object.entries(facet)) {
      filters[name].push({ id, count });
    }
  }

  /** rename facet names to be consistent, and to be what biolink expects in future queries */
  renameKey(filters, "taxon_label", "taxon");
  renameKey(filters, "object_taxon_label", "taxon");

  return filters;
};

/** convert filters to query for passing to api funcs */
export const filtersToQuery = (filters: Filters): Query =>
  mapValues(filters, (array) => array.map(({ id }) => id)) as Query;

/** convert query to params for passing to request func */
export const queryToParams = (
  availableFilters: Query,
  activeFilters: Query
): Params => {
  const params: Params = {};
  for (const [key, query] of Object.entries(activeFilters)) {
    /** do special mapping for certain keys */
    let newQuery = query;
    if (key === "taxon") newQuery = newQuery.map(labelToId);

    /** ignore filter if value "empty" (none active) or "full" (all active) */
    const noneActive = newQuery.length === 0;
    const allActive =
      activeFilters[key]?.length === availableFilters[key]?.length;
    if (!noneActive && !allActive) params[key] = newQuery;
  }

  return params;
};
