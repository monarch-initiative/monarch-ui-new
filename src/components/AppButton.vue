<template>
  <component class="button" :is="component" :data-design="design">
    <span v-if="text">{{ text }}</span>
    <AppIcon :icon="icon" v-if="icon" />
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// component that looks like a button that either does something or goes somewhere
export default defineComponent({
  props: {
    // text to show
    text: String,
    // icon to show
    icon: String,
    // visual design
    // default: filled
    // "plain": no fill
    design: String,
    // location to link to
    to: String,
    // on click action
    click: Function,
  },
  computed: {
    component() {
      if (this.to) return "router-link";
      else return "button";
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  margin: 20px;
  padding: 0 20px;
  font-size: 1rem;
  background: $theme-light;
  color: $off-black;
  border-radius: 3px;
  cursor: pointer;
  transition: background $fast;

  &:hover {
    background: $light-gray;
  }

  &[data-design="plain"] {
    background: none;
    color: currentColor;
  }
}
</style>
