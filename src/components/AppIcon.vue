<template>
  <InlineSvg
    v-if="custom"
    :src="custom"
    class="icon"
    aria-hidden="true"
    :data-circle="circle"
  />
  <FontAwesomeIcon
    v-else-if="fa"
    :icon="fa"
    aria-hidden="true"
    :data-circle="circle"
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
    // fallback icon to show if custom icon file cannot be found
    fallback: String,
    // whether to put circle border around
    circle: Boolean,
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
        if (this.fallback)
          return require(`@/assets/icons/${this.fallback}.svg`);
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
});
</script>

<style lang="scss" scoped>
.icon {
  height: 1em;
}

.icon[data-circle="true"] {
  border-radius: 999px;
  outline: solid 2px currentColor;
  // background: $theme-light;
}
</style>
