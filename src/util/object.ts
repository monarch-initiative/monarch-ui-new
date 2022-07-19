import { kebabCase, mapKeys, merge } from "lodash";

/** object with id field */
type Obj = { id?: string };

/** merge two arrays of objects by id */
export const mergeArrays = (
  arrayA: Array<Obj>,
  arrayB: Array<Obj>,
  /** only include entries that are in array A */
  exclusive = false
): Array<Obj> => {
  /** store to keep id-deduped list of entries */
  const result: Record<string, Obj> = {};

  /** merge func */
  const mergeWithResult =
    (add = true) =>
    (object: Obj) => {
      const { id = "" } = object;
      /** if add flag true, or entry already in store, add to store */
      if (add || result[id])
        /** deep merge array entry with store entry using lodash */
        result[id] = merge(result[id] || {}, object);
    };

  /** run merge func for each array */
  arrayA.forEach(mergeWithResult(true));
  arrayB.forEach(mergeWithResult(!exclusive));

  /** convert object back to array */
  return Object.values(result);
};

/**
 * convert attributes of a vue slot props object to kebab-case.
 * https://github.com/vuejs/core/issues/5477
 */
export const kebabify = (
  object: Record<string, unknown>
): Record<string, unknown> =>
  mapKeys(object, (value, key: string) =>
    key.includes("on") ? key : kebabCase(key)
  );

/** rename key in object in place */
export const renameKey = (
  object: Record<string, unknown>,
  oldKey: string,
  newKey: string
): void => {
  if (object[oldKey]) {
    object[newKey] = object[oldKey];
    delete object[oldKey];
  }
};
