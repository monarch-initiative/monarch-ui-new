<template>
  <div class="tile" :data-design="design">
    <AppLink :to="to || ''" class="button" :aria-label="title">
      <AppIcon :icon="icon" />
    </AppLink>
    <div class="title">{{ title }}</div>
    <div class="subtitle">{{ subtitle }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    // where to link to
    to: String,
    // icon to show in button
    icon: String,
    // main text
    title: String,
    // secondary text
    subtitle: String,
    // visual design
    // default: big
    // "small": smaller button
    design: String,
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
  margin: 20px;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background: $theme-light;
  color: $off-black;
  transition: background $fast;
  font-size: 2rem;

  &:hover {
    background: $light-gray;
  }
}

.tile[data-design="small"] {
  width: 160px;
  margin: 10px;

  .button {
    width: 60px;
    height: 60px;
    font-size: 1.4rem;
  }
}

.title {
  font-size: 1.1rem;
}

.subtitle {
  line-height: $spacing;
}
</style>
