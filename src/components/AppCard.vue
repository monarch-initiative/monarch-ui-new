<!--
  "card" component, with image/icon to left, and arbitrary lines of text content
  to right
-->

<template>
  <div class="card">
    <div class="image" :data-image="!!image">
      <img v-if="image" :src="image" alt="" />
      <AppIcon v-if="icon" :icon="icon" />
    </div>
    <AppFlex h-align="left" direction="col" gap="small" class="text"
      ><slot
    /></AppFlex>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** src of image */
  image?: string;
  /** name of icon */
  icon?: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  gap: 20px;
}

@media (max-width: 400px) {
  .card {
    align-items: center;
    flex-direction: column;
  }
}

.image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  overflow: hidden;

  &[data-image="true"] {
    box-shadow: $shadow;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 100%;
    height: 100%;
    color: $off-black;
  }
}

.text {
  text-align: left;
}
</style>
