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
    route-on-switch="Explore"
  >
    <template #node-search>
      <NodeSearch />
    </template>
    <template #text-annotator>Text Annotator</template>
    <template #phenotype-explorer>Phenotype Explorer</template>
  </AppTabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppTabs from "../../components/AppTabs.vue";
import NodeSearch from "./NodeSearch.vue";

export default defineComponent({
  components: {
    AppTabs,
    NodeSearch,
  },
});
</script>
