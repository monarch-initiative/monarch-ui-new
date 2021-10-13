<template>
  <component :is="to ? 'AppLink' : 'span'" class="detail" :to="to">
    <AppIcon :icon="icon" />
    <span>{{ text }}</span>
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// an icon and text, with optional link
export default defineComponent({
  props: {
    // optional location to link to
    to: String,
    // icon to show
    icon: String,
    // text to show
    text: String,
  },
});
</script>

<style lang="scss" scoped>
.detail {
  display: inline-block;
  margin: 10px;
  text-decoration: none;

  span {
    margin-left: 10px;
    font-weight: 500;
  }
}

span.detail {
  color: $gray;
}
</style>
