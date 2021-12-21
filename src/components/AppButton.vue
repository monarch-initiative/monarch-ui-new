<template>
  <component
    class="button"
    :is="component"
    :to="to"
    @click="click"
    :data-icon="icon ? true : false"
    :data-text="text ? true : false"
  >
    <span v-if="text">{{ text }}</span>
    <AppIcon
      v-if="icon"
      :icon="isExternal && text ? 'external-link-alt' : icon"
    />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { isExternalUrl } from "@/util/url";

// component that looks like a button that either does something or goes somewhere
export default defineComponent({
  props: {
    // text to show
    text: String,
    // icon to show
    icon: String,
    // location to link to
    to: String,
    // on click action
    click: Function,
  },
  computed: {
    // type of component to render
    component() {
      if (this.to) return "AppLink";
      else return "button";
    },
    // is provided slot plain text
    isExternal() {
      return isExternalUrl(this.to);
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
  min-width: 200px; // fallback
  min-width: min(200px, calc(100% - 40px));
  min-height: 40px;
  margin: 20px;
  padding: 5px 20px;
  flex-shrink: 0;
  background: $theme-light;
  color: $off-black;
  border-radius: 3px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: box-shadow $fast, opacity $fast;

  &:focus,
  &:hover {
    box-shadow: 0 0 0 2px $theme;
  }

  &[data-icon="true"][data-text="false"] {
    min-width: unset;
    min-height: unset;
    width: 2.5em;
    height: 2.5em;
    padding: unset;
    border-radius: 999px;
  }
}
</style>
