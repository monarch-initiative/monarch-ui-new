import { CSSProperties, ref, shallowRef } from "vue";
import { computePosition, flip, shift, size } from "@floating-ui/dom";

/**
 * inspired by react-query. simple query manager/wrapper for making queries in
 * components. reduces repetitive boilerplate code for loading/error states,
 * try/catch blocks, de-duplicating requests, etc.
 */
export const useQuery = <Data, Args extends Array<unknown>>(
  /**
   * main async func that returns data. should be side-effect free to avoid race
   * conditions, because multiple can be running at same time.
   */
  func: (...args: Args) => Promise<Data>,
  /** default value used for data before done loading and on error. */
  defaultValue: Data,
  /**
   * func to run on success. use for side effects. only gets called on latest of
   * concurrent runs.
   */
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
  async function query(...args: Args): Promise<void> {
    try {
      /** unique id for current run */
      const current = Symbol();
      latest = current;

      /** reset state */
      isLoading.value = true;
      isError.value = false;
      isSuccess.value = false;
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
      } else {
        /** otherwise, log special "stale" error */
        console.error("Stale query");
      }
    } catch (error) {
      /** log error */
      console.error(error);

      /** update state */
      isError.value = true;
      isLoading.value = false;
    }
  }

  return { query, data, isLoading, isError, isSuccess };
};

/** use floating-ui to position dropdown */
export const useFloating = () => {
  /** style of dropdown */
  const style = ref<CSSProperties>({
    position: "absolute",
    left: "0px",
    top: "0px",
    minWidth: "0px",
  });

  /** func to recompute position on command */
  async function calculate(anchor?: HTMLElement, dropdown?: HTMLElement) {
    if (!anchor || !dropdown) return;

    /** floating-ui options */
    const options = {
      middleware: [
        flip(),
        shift({ padding: 5 }),
        size({
          /** update min width based on target width */
          apply: ({ rects }) =>
            (style.value.minWidth = rects.reference.width + "px"),
        }),
      ],
    };
    /** use floating-ui to compute position of dropdown */
    const { x, y } = await computePosition(anchor, dropdown, options);

    /** set style from position */
    style.value.left = x + "px";
    style.value.top = y + "px";
  }

  return { calculate, style };
};
