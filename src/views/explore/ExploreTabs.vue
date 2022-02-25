<template>
  <AppTabs
    name="Explore Mode"
    :tabs="[
      { id: 'node-search', text: 'Node Search', icon: 'search' },
      { id: 'text-annotator', text: 'Text Annotator', icon: 'subscript' },
      {
        id: 'phenotype-explorer',
        text: 'Phenotype Explorer',
        icon: 'bars-progress',
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
    <template #phenotype-explorer>Phenotype Explorer</template>
  </AppTabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppTabs from "@/components/AppTabs.vue";
import NodeSearch from "./NodeSearch.vue";
import TextAnnotator from "./TextAnnotator.vue";

export default defineComponent({
  components: {
    AppTabs,
    NodeSearch,
    TextAnnotator,
  },
  methods: {
    // when tabs change, navigate to explore page
    onChange() {
      this.$router.push({ ...this.$route, name: "Explore" });
    },
  },
});
</script>
