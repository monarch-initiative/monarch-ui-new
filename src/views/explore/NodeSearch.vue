<template>
  <AppInput
    placeholder="Search for a gene, disease, phenotype, etc."
    icon="search"
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AppInput from "../../components/AppInput.vue";

export default defineComponent({
  components: {
    AppInput,
  },
});
</script>
