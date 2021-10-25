<template>
  <component v-if="custom" :is="custom" />
  <FontAwesomeIcon v-else :icon="[prefix, name]" />
</template>

<script lang="ts">
import { defineComponent, Component } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { customIcons } from "@/global/icons";

const prefixes = ["fas", "far", "fab"];

// wrapper for font awesome icon component to make it behave more logically
// and to allow for adding custom icons
export default defineComponent({
  props: {
    // icon to show in button
    icon: String,
  },
  components: {
    FontAwesomeIcon,
  },
  computed: {
    // find custom icon with maching name, if there is one
    custom(): Component | null {
      for (const [name, icon] of Object.entries(customIcons))
        if (name.toLowerCase() === this.icon) return icon;

      return null;
    },
    // font awesome icon prefix, e.g. fab or fas
    prefix() {
      let prefix = (this.icon || "").split(" ")[0];
      if (!prefixes.includes(prefix)) prefix = "fas";
      return prefix;
    },
    // font awesome icon name, e.g. envelope
    name() {
      return (this.icon || "").split(" ").pop();
    },
  },
});
</script>
