<!--
  explore landing page
-->

<template>
  <AppSection>
    <AppHeading>Explore</AppHeading>

    <AppTabs v-model="tab" name="Explore Mode" :tabs="tabs" />

    <p>{{ description }}</p>
  </AppSection>

  <NodeSearch v-if="tab === 'node-search'" />

  <TextAnnotator v-if="tab === 'text-annotator'" />

  <PhenotypeExplorer v-if="tab === 'phenotype-explorer'" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AppTabs from "@/components/AppTabs.vue";
import NodeSearch from "./NodeSearch.vue";
import TextAnnotator from "./TextAnnotator.vue";
import PhenotypeExplorer from "./PhenotypeExplorer.vue";
import tabs from "./tabs.json";

const tab = ref(tabs[0].id);

const description = computed(
  () => tabs.find(({ id }) => id === tab.value)?.description
);
</script>
