<template>
  <AppSection>
    <AppHeading>Explore</AppHeading>
  </AppSection>
  <AppSection>
    <AppTabs
      name="Explore Mode"
      :tabs="[
        { id: 'search', text: 'Node Search', icon: 'search' },
        { id: 'annotator', text: 'Text Annotator', icon: 'subscript' },
        { id: 'phenotype', text: 'Phenotype Explorer', icon: 'map' },
      ]"
      default="search"
    >
      <template #search> Node Search </template>
      <template #annotator> Text Annotator </template>
      <template #phenotype> Phenotype Explorer </template>
    </AppTabs>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppTabs from "../../components/AppTabs.vue";

export default defineComponent({
  components: {
    AppTabs,
  },
});
</script>
