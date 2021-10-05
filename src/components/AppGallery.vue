<template>
  <!-- puts arbitrary content into a responsive grid gallery -->
  <div class="gallery">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
$tablet: 800px;
$phone: 400px;

.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: $phone) {
    grid-template-columns: 1fr;
  }
}
</style>
