<!--
  different explore modes. separate into its own component because it is also
  on homepage.
-->

<template>
  <AppTabs
    name="Explore Mode"
    :tabs="[
      {
        id: 'node-search',
        text: 'Node Search',
        icon: 'search',
        tooltip:
          'Search our knowledge graph for genes, diseases, phenotypes, etc.',
      },
      {
        id: 'text-annotator',
        text: 'Text Annotator',
        icon: 'subscript',
        tooltip:
          'Search full text for references to things in our knowledge graph',
      },
      {
        id: 'phenotype-explorer',
        text: 'Phenotype Explorer',
        icon: 'bars-progress',
        tooltip: 'Compare two sets of phenotypes, and more',
      },
    ]"
    default="node-search"
    @change="onChange"
  >
    <template #node-search>
      <NodeSearch />
    </template>
    <template #text-annotator>
      <TextAnnotator />
    </template>
    <template #phenotype-explorer>
      <PhenotypeExplorer />
    </template>
  </AppTabs>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import AppTabs from "@/components/AppTabs.vue";
import NodeSearch from "./NodeSearch.vue";
import TextAnnotator from "./TextAnnotator.vue";
import PhenotypeExplorer from "./PhenotypeExplorer.vue";

/** route info */
const router = useRouter();
const route = useRoute();

/** when tabs change, navigate to explore page */
function onChange() {
  router.push({ ...route, name: "Explore" });
}
</script>
