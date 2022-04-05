<!--
  homepage of entire site
-->

<template>
  <AppSection design="fill">
    <ExploreTabs />
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
import ExploreTabs from "./explore/ExploreTabs.vue";
</script>
