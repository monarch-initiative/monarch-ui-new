import { mapValues } from "lodash";
import { Params } from ".";
import { Options } from "@/components/AppSelectMulti.d";
import { getIdsFromLabels } from "./taxons";
import { renameKey } from "./../util/object";

/** format of facet counts returned from biolink */
export type Facets = Record<string, Record<string, number>>;

/** set of filters compatible with select options list */
export type Filters = Record<string, Options>;

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

  /** delete certain facets (explicitly, opt-out) that we dont' want to show */
  delete filters["_taxon_map"];

  /** rename facet names to be consistent, and to be what biolink expects in future queries */
  renameKey(filters, "taxon_label", "taxon");
  renameKey(filters, "object_taxon_label", "taxon");

  return filters;
};

/** convert filters to query for passing to api funcs */
export const filtersToQuery = (filters: Filters): Query =>
  mapValues(filters, (array) => array.map(({ id }) => id)) as Query;

/** convert query to params for passing to request func */
export const queryToParams = async (
  availableFilters: Query,
  activeFilters: Query
): Promise<Params> => {
  const params: Params = {};
  for (const [key, query] of Object.entries(activeFilters)) {
    /** ignore filter if value "empty" (none active) or "full" (all active) */
    const noneActive = query.length === 0;
    const allActive =
      activeFilters[key]?.length === availableFilters[key]?.length;
    if (noneActive || allActive) continue;

    /** do special mapping for certain keys */
    let mapped = query;
    if (key === "taxon") mapped = await getIdsFromLabels(mapped);

    /** set param */
    params[key] = mapped;
  }

  return params;
};
