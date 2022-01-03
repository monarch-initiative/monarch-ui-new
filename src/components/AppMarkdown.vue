<template>
  <component :is="component || 'div'" v-html="html" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { micromark } from "micromark";

// takes a string of basic markdown and renders html
// only use on a per paragraph basis. do not use with headings.
export default defineComponent({
  props: {
    // markdown input source
    source: {
      type: String,
      required: true,
    },
    // what component to wrap source in (defaults to div)
    component: String,
  },
  computed: {
    html() {
      return micromark(this.source || "")
        .replaceAll("<p>", "")
        .replaceAll("</p>", "");
    },
  },
});
</script>
