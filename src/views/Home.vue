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

<script lang="ts">
import { defineComponent } from "vue";
import ExploreTabs from "./explore/ExploreTabs.vue";

export default defineComponent({
  components: {
    ExploreTabs,
  },
});
</script>
