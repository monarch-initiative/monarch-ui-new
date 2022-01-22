<template>
  <AppSection>
    <AppHeading>Feedback Form</AppHeading>
    <TheFeedbackForm />
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheFeedbackForm from "@/components/TheFeedbackForm.vue";

export default defineComponent({
  components: {
    TheFeedbackForm,
  },
});
</script>

<style lang="scss" scoped></style>
