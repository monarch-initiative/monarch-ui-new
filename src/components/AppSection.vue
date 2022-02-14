<template>
  <section :data-width="width" :data-design="design">
    <slot />
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// section that spans width of page
// contains, aligns, and evenly vertically spaces its contents
// all main page content should be contained within one of these
export default defineComponent({
  props: {
    // width of section
    width: {
      default: "medium",
      type: String as PropType<"full" | "medium" | "big">,
    },
    // visual design
    design: {
      default: "normal",
      type: String as PropType<"normal" | "fill">,
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  text-align: center;

  &[data-width="full"] {
    padding: 50px 40px;
  }

  &[data-width="medium"] {
    padding: 50px max(40px, calc((100% - $section) / 2));
  }

  &[data-width="big"] {
    padding: 50px max(40px, calc((100% - $section-big) / 2));
  }

  &[data-design="normal"] {
    &:nth-child(odd) {
      background: $white;
    }

    &:nth-child(even) {
      background: $off-white;
    }
  }

  &[data-design="fill"] {
    background: $theme-light;
  }

  &:last-of-type {
    flex-grow: 1;
  }
}
</style>
