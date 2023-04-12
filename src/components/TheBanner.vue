<!--
  checkbox with arbitrary content (slot) and icon
-->

<template>
  <aside v-if="open" class="banner">
    <div>
      This is the "old" version of the Monarch UI version 3.0. It will be
      deleted soon and should not be used or referenced. See
      <a href="https://github.com/monarch-initiative/monarch-ui-new">
        the readme
      </a>
      for more info.
    </div>
    <AppButton icon="times" text="Close" design="small" @click="open = false" />
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";

const open = ref(true);
</script>

<style lang="scss" scoped>
.banner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background: $theme-light;
  text-align: center;
}
</style>
