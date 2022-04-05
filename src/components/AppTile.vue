<!--
  big circular link button with text and sub text
-->

<template>
  <div class="tile" :data-design="design">
    <AppButton
      design="circle"
      :to="to || ''"
      class="button"
      :icon="icon"
      :aria-label="title"
    />
    <div class="title">{{ title }}</div>
    <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  // where to link to
  to: string;
  // icon to show in button
  icon: string;
  // main text
  title: string;
  // secondary text
  subtitle?: string;
  // visual design
  design?: "small" | "big";
}

withDefaults(defineProps<Props>(), { subtitle: "", design: "big" });
</script>

<style lang="scss" scoped>
.tile {
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  gap: 15px;
  width: 180px;

  .button {
    font-size: 2rem;
  }
}

.tile[data-design="small"] {
  width: 160px;

  .button {
    font-size: 1.4rem;
  }
}

.title {
  font-size: 1.1rem;
}

.subtitle {
  color: $off-black;
  line-height: $spacing;
}
</style>
