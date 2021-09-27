<template>
  <span v-html="html"></span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { micromark } from "micromark";

// takes a string of basic markdown and renders html
export default defineComponent({
  props: { source: String },
  computed: {
    html() {
      return micromark(this.source || "");
    },
  },
});
</script>
