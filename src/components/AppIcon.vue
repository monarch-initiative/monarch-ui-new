<template>
  <component v-if="custom" :is="custom" />
  <FontAwesomeIcon v-else-if="fa" :icon="fa" />
</template>

<script lang="ts">
import { defineComponent, Component } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { customIcons } from "@/global/icons";
import {
  findIconDefinition,
  IconPrefix,
  IconName,
} from "@fortawesome/fontawesome-svg-core";

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
  },
  computed: {
    // find custom icon with matching name, if there is one
    custom(): Component | null {
      for (const [name, icon] of Object.entries(customIcons))
        if (name.toLowerCase() === this.icon) return icon;

      return null;
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
