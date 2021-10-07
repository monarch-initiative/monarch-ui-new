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
    size: String,
  },
});
</script>

<style lang="scss" scoped>
$two: 900px;
$one: 600px;

.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
  max-width: 1000px;
  margin: 40px auto;

  &[data-size="small"] {
    gap: 10px;
  }

  @media (max-width: $two) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: $one) {
    grid-template-columns: 1fr;
  }
}

.gallery :deep(*) {
  margin: 0;
}
</style>
