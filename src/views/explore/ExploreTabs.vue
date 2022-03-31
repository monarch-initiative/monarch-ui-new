<template>
  <AppTabs
    name="Explore Mode"
    :tabs="[
      {
        id: 'node-search',
        text: 'Node Search',
        icon: 'search',
        description:
          'Search our extensive knowledge graphs to find particular nodes — such as genes, diseases, phenotypes, genotypes, variants, and more — and see rich information about them — such as related nodes, publications, and more.',
        tooltip:
          'Search our knowledge graph for genes, diseases, phenotypes, etc.',
      },
      {
        id: 'text-annotator',
        text: 'Text Annotator',
        icon: 'subscript',
        description:
          'Same as the node search, but searches full text and finds references to nodes that are in our knowledge graph.',
        tooltip:
          'Search full text for references to things in our knowledge graph',
      },
      {
        id: 'phenotype-explorer',
        text: 'Phenotype Explorer',
        icon: 'bars-progress',
        description:
          'Construct two sets of phenotypes and see various comparisons between them. You can use this to find phenotypically similar diseases or genes in a variety of organisms and visualize their overlap.',
        tooltip: 'Compare two sets of phenotypes, and more',
      },
    ]"
    default="node-search"
    :showDescription="!home"
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

<script lang="ts">
import { defineComponent } from "vue";
import AppTabs from "@/components/AppTabs.vue";
import NodeSearch from "./NodeSearch.vue";
import TextAnnotator from "./TextAnnotator.vue";
import PhenotypeExplorer from "./PhenotypeExplorer.vue";

// different explore modes
// separate into its own component because it is also on homepage
export default defineComponent({
  components: {
    AppTabs,
    NodeSearch,
    TextAnnotator,
    PhenotypeExplorer,
  },
  computed: {
    // is home page
    home(): boolean {
      return String(this.$route.name).toLowerCase() === "home";
    },
  },
  methods: {
    // when tabs change, navigate to explore page
    onChange() {
      this.$router.push({ ...this.$route, name: "Explore" });
    },
  },
});
</script>
