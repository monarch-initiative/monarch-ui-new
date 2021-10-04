<template>
  <button :data-design="design">
    <span v-if="text">{{ text }}</span>
    <FontAwesomeIcon :icon="icon" v-if="icon" />
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: String,
    icon: String,
    design: String,
  },
});
</script>

<style lang="scss" scoped>
button {
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 10px 20px;
}
</style>
