<!--
  homepage of entire site
-->

<template>
  <AppSection design="fill">
    <AppTabs v-model="tab" name="Explore Mode" :tabs="tabs" route="Explore" />
    <NodeSearch />
  </AppSection>
  <AppSection>
    <AppHeading>What is Monarch</AppHeading>
    <AppPlaceholder />
    <AppButton to="/about" text="Learn more" icon="arrow-right" />
  </AppSection>
  <AppSection>
    <AppHeading>Features</AppHeading>
    <AppPlaceholder />
  </AppSection>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppTabs from "@/components/AppTabs.vue";
import tabs from "./explore/tabs.json";
import NodeSearch from "./explore/NodeSearch.vue";

const tab = ref(tabs[0].id);
</script>
