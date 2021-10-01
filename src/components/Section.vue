<template>
  <section :data-full="full || full">
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// section that spans width of page
export default defineComponent({
  props: {
    // whether content spans full page width or limited to page sass var
    full: Boolean,
  },
});
</script>

<style lang="scss" scoped>
section {
  padding: 40px; // fallback

  &[data-full="false"] {
    padding: 40px max(40px, calc((100% - $page) / 2));
  }
}

section:nth-child(odd) {
  background: $white;
}

section:nth-child(even) {
  background: $off-white;
}
</style>
