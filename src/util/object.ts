import { merge } from "lodash";

// merge two arrays of objects by id
// if exclusive, only include entries that are in array A
type Obj = { id?: string };
export const mergeArrays = (
  arrayA: Array<Obj>,
  arrayB: Array<Obj>,
  exclusive = false
): Array<Obj> => {
  // store to keep id-deduped list of entries
  const result: Record<string, Obj> = {};

  // merge func
  const mergeWithResult =
    (add = true) =>
    (object: Obj) => {
      const { id = "" } = object;
      // entry not already in store, and add option off, don't add to store
      if (!result[id] && !add) return;
      // deep merge array entry with store entry using lodash
      result[id] = merge(result[id] || {}, object);
    };

  // run merge func for each array
  arrayA.forEach(mergeWithResult(true));
  arrayB.forEach(mergeWithResult(!exclusive));

  // convert object back to array
  return Object.values(result);
};