import { ref, watch } from "vue";

/**
 * index.html is statically generated using the following hard-coded meta data
 * environment variables, specified in the .env file. convert these values into
 * reactive variables that we can change during run time, and update document
 * tags accordingly.
 */

/** variables */
export const appTitle = ref(process.env.VUE_APP_TITLE);
export const appDescription = ref(process.env.VUE_APP_DESCRIPTION);
export const appUrl = ref(process.env.VUE_APP_DESCRIPTION);

/** update document title meta tags */
watch(appTitle, () => {
  document.title = appTitle.value || "";
  setTag("title", appTitle.value);
  setTag("og:title", appTitle.value);
  setTag("twitter:title", appTitle.value);
});

/** update document description meta tags */
watch(appDescription, () => {
  setTag("description", appDescription.value);
  setTag("og:description", appDescription.value);
  setTag("twitter:description", appDescription.value);
});

/** update document url meta tags */
watch(appUrl, () => {
  document
    .querySelector("link[rel='canonical']")
    ?.setAttribute("href", appUrl.value || "");
  setTag("og:url", appUrl.value);
  setTag("twitter:url", appUrl.value);
});

/** set meta data value */
const setTag = (property = "", value = "") =>
  document
    .querySelector(`meta[name='${property}'], meta[property='${property}']`)
    ?.setAttribute("content", value);
