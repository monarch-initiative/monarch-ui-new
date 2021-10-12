<template>
  <!-- puts arbitrary content into a responsive grid gallery -->
  <div class="gallery" :data-size="size">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    // size of items in gallery
    // default: medium
    // "small": smaller items and spacing
    // "big": larger and fewer items
    size: String,
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
  gap: 40px;
  margin: 40px auto;

  &[data-size="small"] {
    gap: 10px;
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

.gallery :deep(*) {
  margin: 0;
}
</style>
