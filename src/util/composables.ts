import { ref, shallowRef } from "vue";

/**
 * inspired by react-query. simple query manager/wrapper for making queries in
 * components. reduces repetitive boilerplate code for loading/error states,
 * try/catch blocks, de-staling/de-duplicating requests, etc.
 */
export const useQuery = <Data, Args extends Array<unknown>>(
  /** async func that returns data. should be side-effect free. */
  func: (...args: Args) => Promise<Data>,
  /** default value used for data before done loading and on error. */
  defaultValue: Data,
  /** function to run on success. use for side effects that only need to run on success. */
  onSuccess?: (
    /** response data */
    response: Data,
    /** props passed to main func */
    props: Args
  ) => void
) => {
  /** query state/status */
  const isLoading = ref(false);
  const isError = ref(false);
  const isSuccess = ref(false);

  /** query results */
  /** https://github.com/vuejs/composition-api/issues/483 */
  const data = shallowRef<Data>(defaultValue);

  /** latest query id, unique to this useQuery instance */
  let latest;

  /** wrapped query function */
  async function query(...args: Args): Promise<Data> {
    try {
      /** unique id for current run */
      const current = Symbol();
      latest = current;

      /** update state */
      isLoading.value = true;
      data.value = defaultValue;

      /** run provided function */
      const result = await func(...args);

      /** if this run still the latest */
      if (current === latest) {
        /** assign results to data */
        data.value = result;

        /** update state */
        isLoading.value = false;
        isSuccess.value = true;

        /** on success callback */
        if (onSuccess) onSuccess(result, args);

        /** return results */
        return result;
      } else {
        /** otherwise, throw special "stale" error */
        throw new Error("Stale query");
      }
    } catch (error) {
      /** stale */
      if ((error as Error).message.match(/stale/i)) {
        console.groupCollapsed("Stale query");
        console.error(error);
        console.groupEnd();
      } else {
        /** log error */
        console.error(error);

        /** update state */
        isError.value = true;
        isLoading.value = false;
      }

      return defaultValue;
    }
  }

  return { query, data, isLoading, isError, isSuccess };
};
