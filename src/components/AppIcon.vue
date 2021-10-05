<template>
  <FontAwesomeIcon :icon="[prefix, name]" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const prefixes = ["fas", "far", "fab"];

// wrapper for font awesome icon component to make it behave more logically
// and to allow for adding custom icons later
export default defineComponent({
  props: {
    // icon to show in button
    icon: String,
  },
  components: {
    FontAwesomeIcon,
  },
  computed: {
    prefix() {
      let prefix = (this.icon || "").split(" ")[0];
      if (!prefixes.includes(prefix)) prefix = "fas";
      return prefix;
    },
    name() {
      return (this.icon || "").split(" ").pop();
    },
  },
});
</script>
