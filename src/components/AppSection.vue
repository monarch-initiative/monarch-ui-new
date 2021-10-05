<template>
  <section :data-full="full || false" :data-design="design">
    <slot />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// section that spans width of page
export default defineComponent({
  props: {
    // whether content spans full page width or limited to page sass var
    full: Boolean,
    // visual design
    // default: white/offwhite
    // "fill": darker bg
    design: String,
  },
});
</script>

<style lang="scss" scoped>
section {
  padding: 60px 40px; // fallback

  &[data-full="false"] {
    padding: 60px max(40px, calc((100% - $page) / 2));
  }

  text-align: center;
}

section:nth-child(odd) {
  background: $white;
}

section:nth-child(even) {
  background: $off-white;
}

section[data-design="fill"] {
  background: $theme-light;
}
</style>
