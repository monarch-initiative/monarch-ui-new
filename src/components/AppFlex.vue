<template>
  <div
    class="flex"
    :data-direction="direction"
    :data-gap="gap"
    :data-wrap="wrap"
    :style="{ justifyContent, alignItems }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// map nice human align names to css flex align names
const alignMap = {
  left: "flex-start",
  top: "flex-start",
  center: "center",
  right: "flex-end",
  bottom: "flex-end",
  stretch: "stretch",
};

// utility component to conveniently and consistently align and space items
// use only for basic flex needs. anything more (like media queries), use custom css
export default defineComponent({
  props: {
    // horizontal or vertical
    direction: {
      type: String as PropType<"row" | "col">,
      default: "row",
    },
    // spacing between items
    gap: {
      type: String as PropType<"none" | "small" | "medium" | "big">,
      default: "medium",
    },
    // horizontal alignment
    hAlign: {
      type: String as PropType<"left" | "center" | "right" | "stretch">,
      default: "center",
    },
    // vertical alignment
    vAlign: {
      type: String as PropType<"top" | "center" | "bottom" | "stretch">,
      default: "center",
    },
    // whether to wrap
    wrap: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    justifyContent(): string {
      return this.direction === "col"
        ? alignMap[this.vAlign]
        : alignMap[this.hAlign];
    },
    alignItems(): string {
      return this.direction === "col"
        ? alignMap[this.hAlign]
        : alignMap[this.vAlign];
    },
  },
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  width: 100%;

  &[data-direction="row"] {
    flex-wrap: wrap;
  }

  &[data-direction="col"] {
    flex-direction: column;
  }

  &[data-gap="none"] {
    gap: 0;
  }
  &[data-gap="small"] {
    gap: 10px;
  }
  &[data-gap="medium"] {
    gap: 20px;
  }
  &[data-gap="big"] {
    gap: 40px;
  }
}
</style>
