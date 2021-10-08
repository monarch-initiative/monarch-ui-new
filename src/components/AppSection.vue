<template>
  <section :data-width="width || 'medium'" :data-design="design">
    <slot />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// section that spans width of page
export default defineComponent({
  props: {
    // width of section
    // default: medium width
    // "big": bigger than medium width
    // "full": full width of screen
    width: String,
    // visual design
    // default: white/offwhite
    // "fill": darker bg
    design: String,
  },
});
</script>

<style lang="scss" scoped>
section {
  padding: 50px 40px; // full width

  &[data-width="medium"] {
    padding: 50px max(40px, calc((100% - $section) / 2));
  }

  &[data-width="big"] {
    padding: 50px max(40px, calc((100% - $section-big) / 2));
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
