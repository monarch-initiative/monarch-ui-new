<template>
  <InlineSvg v-if="custom" :src="custom" class="icon" aria-hidden="true" />
  <FontAwesomeIcon v-else-if="fa" :icon="fa" aria-hidden="true" />
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
        return false;
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
});
</script>

<style lang="scss" scoped>
.icon {
  height: 1em;
}
</style>
