<template>
  <span v-if="!to" role="link">
    <slot />
  </span>
  <a v-else-if="isExternal" :href="to" target="_blank">
    <template v-if="isPlainText">
      <span>
        <slot />
      </span>
      <AppIcon icon="external-link-alt" />
    </template>
    <slot v-else />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { isExternalUrl } from "@/util/url";

// unified wrapper for internal (router) or external (other-domain) links
export default defineComponent({
  props: {
    // location to link to
    to: String,
  },
  computed: {
    // is to prop an external url
    isExternal() {
      return isExternalUrl(this.to);
    },
    // is provided slot plain text
    isPlainText() {
      return (
        this.$slots.default &&
        this.$slots.default().length === 1 &&
        typeof this.$slots.default()[0].children === "string"
      );
    },
  },
});
</script>
