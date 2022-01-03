<template>
  <!-- puts arbitrary content into a responsive grid gallery -->
  <div class="gallery" :data-size="size">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    // size of items in gallery
    size: {
      default: "medium",
      type: String as PropType<"small" | "medium" | "big">,
    },
  },
});
</script>

<style lang="scss" scoped>
$two: 900px;
$one: 600px;
$cell: minmax(100px, 1fr);

.gallery {
  display: grid;
  grid-template-columns: $cell $cell $cell;
  justify-items: stretch;

  &[data-size="small"] {
    gap: 20px;
  }

  &[data-size="medium"] {
    gap: 40px;
  }

  &[data-size="big"] {
    gap: 40px;
    grid-template-columns: $cell $cell;

    @media (max-width: $one) {
      grid-template-columns: $cell;
    }
  }

  @media (max-width: $two) {
    grid-template-columns: $cell $cell;
  }

  @media (max-width: $one) {
    grid-template-columns: $cell;
  }
}

// force no margins for children since grid already provides gap
.gallery > :deep(*) {
  margin: 0 !important;
}
</style>
