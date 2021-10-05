<template>
  <a v-if="isExternal" :href="to">
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
      return ((this.to || "") as string).startsWith("http");
    },
  },
});
</script>
