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

<script lang="ts">
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  findIconDefinition,
  IconPrefix,
  IconName,
} from "@fortawesome/fontawesome-svg-core";
import InlineSvg from "vue-inline-svg";

// wrapper for font awesome icon component to make it behave more logically
// and to allow for adding custom icons
export default defineComponent({
  props: {
    // icon to show in button
    icon: {
      type: String,
      required: true,
    },
  },
  components: {
    FontAwesomeIcon,
    InlineSvg,
  },
  computed: {
    // find custom icon with matching name, if there is one
    custom() {
      try {
        return require(`@/assets/icons/${this.icon}.svg`);
      } catch (error) {
        if (this.icon.startsWith("category-"))
          return require(`@/assets/icons/category-fallback.svg`);
        else return false;
      }
    },
    // find font awesome icon with matching name, if there is one
    fa() {
      for (const prefix of ["fas", "far", "fab"]) {
        const match = findIconDefinition({
          prefix: prefix as IconPrefix,
          iconName: this.icon as IconName,
        });
        if (match) return match;
      }

      return null;
    },
  },
  methods: {
    // when custom svg icon inlined/loaded
    loadedInline(element: HTMLElement) {
      if (!element?.style) return;

      // get absolute display size of icon in px
      const size = Number.parseFloat(window.getComputedStyle(element).fontSize);

      // stroke inversely with size
      let stroke;
      if (size >= 32) stroke = 4;
      else if (size >= 24) stroke = 5;
      else stroke = 6;

      // set stroke width css variable
      element?.style?.setProperty("--stroke", stroke + "px");
    },
  },
});
</script>

<style lang="scss" scoped>
.icon {
  height: 1em;
}

// common category icon styles
[data-icon^="category-"] {
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
