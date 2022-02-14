<template>
  <AppTabs
    name="Explore Mode"
    :tabs="[
      { id: 'search', text: 'Node Search', icon: 'search' },
      { id: 'annotator', text: 'Text Annotator', icon: 'subscript' },
      { id: 'phenotype', text: 'Phenotype Explorer', icon: 'bars-progress' },
    ]"
    default="search"
  >
    <template #search>
      <NodeSearch />
    </template>
    <template #annotator>Text Annotator</template>
    <template #phenotype>Phenotype Explorer</template>
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
