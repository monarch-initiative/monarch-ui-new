<template>
  <AppSection design="fill">
    <AppHeading>Explore</AppHeading>
    <AppInput placeholder="Search for something" />
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
import AppInput from "@/components/AppInput.vue";

export default defineComponent({
  components: {
    AppInput,
  },
});
</script>
