<!--
  wrapper for font awesome icon or custom icon loaded inline
-->

<template>
  <InlineSvg
    v-if="custom"
    :src="custom"
    class="icon"
    aria-hidden="true"
    :data-icon="icon"
    @loaded="loadedInline"
  />
  <FontAwesomeIcon
    v-else-if="fa"
    :icon="fa"
    :data-icon="icon"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  findIconDefinition,
  IconPrefix,
  IconName,
} from "@fortawesome/fontawesome-svg-core";
import InlineSvg from "vue-inline-svg";
import { computed } from "vue";

interface Props {
  /**
   * kebab-case name of icon to show. for font awesome, without fas/far/etc
   * prefix. for custom icon, match filename, without extension.
   */
  icon: string;
}

const props = defineProps<Props>();

/** find custom icon with matching name, if there is one */
const custom = computed((): string => {
  try {
    return require(`@/assets/icons/${props.icon}.svg`);
  } catch (error) {
    if (props.icon.startsWith("category-"))
      return require(`@/assets/icons/category-fallback.svg`);
    else return "";
  }
});

/** find font awesome icon with matching name, if there is one */
const fa = computed(() => {
  for (const prefix of ["fas", "far", "fab"]) {
    const match = findIconDefinition({
      prefix: prefix as IconPrefix,
      iconName: props.icon as IconName,
    });
    if (match) return match;
  }

  return null;
});

/** when custom svg icon inlined/loaded */
function loadedInline(element: HTMLElement) {
  if (!element?.style) return;

  /** get absolute display size of icon in px */
  const size = Number.parseFloat(window.getComputedStyle(element).fontSize);

  /** stroke inversely with size */
  let stroke;
  if (size >= 32) stroke = 4;
  else if (size >= 24) stroke = 5;
  else stroke = 6;

  /** set stroke width css variable */
  element?.style?.setProperty("--stroke", stroke + "px");
}
</script>

<style lang="scss" scoped>
.icon {
  height: 1em;
}

/** common category icon styles */
[data-icon^="category-"] {
  height: 1.2em;
  fill: none;
  stroke: currentColor;
  stroke-width: var(--stroke);
  stroke-linecap: round;
  stroke-linejoin: round;

  & > circle:first-child {
    display: none;
  }
}
</style>
