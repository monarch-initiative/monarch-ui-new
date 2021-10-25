<template>
  <span v-if="!to" role="link">
    <slot />
  </span>
  <a v-else-if="isExternal" :href="to" target="_blank">
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// unified wrapper for internal (router) or external (other-domain) links
export default defineComponent({
  props: {
    // location to link to
    to: String,
  },
  computed: {
    isExternal() {
      const url = String(this.to || "");
      return (
        url.startsWith("http") ||
        url.startsWith("ftp") ||
        url.startsWith("mailto:")
      );
    },
  },
});
</script>
