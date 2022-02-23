<template>
  <AppSection>
    <AppHeading>Explore</AppHeading>
    <ExploreTabs />
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ExploreTabs from "./ExploreTabs.vue";

export default defineComponent({
  components: {
    ExploreTabs,
  },
});
</script>
