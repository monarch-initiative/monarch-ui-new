<template>
  <div class="flex" :data-direction="direction" :data-gap="gap">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

// utility component to conveniently and consistently align and space items
export default defineComponent({
  props: {
    // horizontal or vertical
    direction: {
      default: "row",
      type: String as PropType<"row" | "col">,
    },
    // spacing between items
    gap: {
      default: "medium",
      type: String as PropType<"small" | "medium" | "big">,
    },
  },
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;

  &[data-direction="col"] {
    flex-direction: column;
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
