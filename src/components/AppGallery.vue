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
    // default: medium
    // "small": smaller spacing
    // "big": larger and fewer items
    size: String as PropType<"small" | "big" | undefined>,
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
  gap: 40px;
  margin: 40px auto;

  &[data-size="small"] {
    gap: 20px;
  }

  &[data-size="big"] {
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
.gallery :deep(*) {
  margin: 0 !important;
}
</style>
