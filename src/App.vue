<!--
  entry point for entire app
-->

<template>
  <TheHeader />
  <main>
    <router-view />
    <TheFloatButtons />
    <TheSnackbar />
  </main>
  <TheFooter />
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { startCase } from "lodash";
import "normalize.css";
import "@/global/icons";
import "@/global/styles.scss"; /** keep these last so they take priority */
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import TheFloatButtons from "@/components/TheFloatButtons.vue";
import TheSnackbar from "./components/TheSnackbar.vue";
import { appTitle, appDescription, appUrl } from "@/global/meta";

/** when route changes, update document meta data. see https://metatags.io/ */
const route = useRoute();
watch(
  () => route.fullPath,
  async () => {
    /** document title */
    let title = String(route.name);

    /** explore page */
    if (route.name === "Explore") if (route.hash) title = startCase(route.hash);

    /** node page */
    if (route.name === "Node")
      title =
        startCase(String(route.params.category)) +
        " " +
        String(route.params.id);

    if (route.query.associations)
      title += ` | ${route.query.associations} assoc.`;

    /** add app title */
    if (route.name !== "Home") title += " | " + process.env.VUE_APP_TITLE;

    /** update title */
    appTitle.value = title;

    /**
     * update description. description set in components should override this,
     * since this component is root and renders first.
     */
    appDescription.value =
      (route.meta.description as string) || process.env.VUE_APP_DESCRIPTION;

    /** update canonical url */
    appUrl.value = window.location.href;
  }
);
</script>
