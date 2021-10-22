<template>
  <button
    class="title"
    @click="expanded = !expanded"
    :aria-expanded="expanded"
    :aria-label="expanded ? 'Collapse section' : 'Expand section'"
  >
    <span class="text">
      <slot name="title" />
    </span>
    <AppIcon :icon="expanded ? 'angle-up' : 'angle-down'" />
  </button>
  <div v-if="expanded" class="content">
    <slot name="content" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      // whether accordion is open or not
      expanded: false,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  @include trim-v-margins;
  background: $light-gray;
  font-size: 1.1rem;
  transition: background $fast;

  &:hover {
    background: $theme-light;
  }
}

.text {
  flex-grow: 1;
  text-align: left;
}

.content {
  padding: 20px;
}
</style>
