<template>
  <AppLink class="detail" :to="to">
    <AppIcon :icon="icon" />
    <span>{{ text }}</span>
  </AppLink>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// an icon and text, with optional link
export default defineComponent({
  props: {
    // optional location to link to
    to: String,
    // icon to show
    icon: {
      type: String,
      required: true,
    },
    // text to show
    text: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.detail {
  display: inline-block;
  margin: 10px;
  text-decoration: none;

  span {
    font-weight: 500;
  }

  &:not(a) {
    color: $gray;
  }
}
</style>
