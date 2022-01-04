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

<script lang="ts">
import { defineComponent, PropType } from "vue";

// big circular link button with text and sub text
export default defineComponent({
  props: {
    // where to link to
    to: String,
    // icon to show in button
    icon: {
      type: String,
      required: true,
    },
    // main text
    title: {
      type: String,
      required: true,
    },
    // secondary text
    subtitle: String,
    // visual design
    design: {
      default: "big",
      type: String as PropType<"small" | "big">,
    },
  },
});
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
