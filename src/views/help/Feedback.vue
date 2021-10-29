<template>
  <AppSection>
    <AppFeedbackForm />
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppFeedbackForm from "@/components/AppFeedbackForm.vue";

export default defineComponent({
  components: {
    AppFeedbackForm,
  },
});
</script>

<style lang="scss" scoped></style>
