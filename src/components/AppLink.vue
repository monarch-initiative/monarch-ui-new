<template>
  <span v-if="!to">
    <!-- placeholder if no url provided -->
    <slot />
  </span>

  <a v-else-if="isAbsolute" :href="to" target="_blank">
    <!-- use regular html link for absolute urls -->
    <template v-if="isExternal && isPlainText && !noIcon">
      <span>
        <slot />
      </span>
      <AppIcon class="icon" icon="external-link-alt" />
    </template>
    <slot v-else />
  </a>

  <router-link v-else :to="to" :replace="to.startsWith('#')">
    <!-- use vue router component for relative urls -->
    <slot />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { isExternal, isAbsolute } from "@/util/url";

// unified wrapper for internal (router) or external (other-domain) links
// can be wrapped around any component or plain  text
export default defineComponent({
  props: {
    // location to link to
    to: String,
    // whether to forcibly forgo external icon when link is external
    noIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // is "to" prop an external url
    isExternal() {
      return isExternal(this.to);
    },
    // is "to" prop an absolute url
    isAbsolute() {
      return isAbsolute(this.to);
    },
    // is provided slot just plain text
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

<style lang="scss" scoped>
.icon {
  margin-left: 5px;
}
</style>
