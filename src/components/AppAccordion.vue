<template>
  <button
    class="title"
    @click="expanded = !expanded"
    :aria-expanded="expanded"
    :aria-label="expanded ? 'Collapse section' : 'Expand section'"
  >
    <span class="text">
      <span v-if="text">{{ text }}</span>
      <AppIcon v-if="icon" class="icon" :icon="icon" />
    </span>
    <AppIcon class="caret" icon="angle-down" :data-expanded="expanded" />
  </button>
  <div v-if="expanded" class="content">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// button with expandable/collapsible content
export default defineComponent({
  props: {
    // text to show in title
    text: String,
    // icon to show in title
    icon: String,
  },
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
  padding: 10px;
  border-bottom: solid 2px $light-gray;
  font-size: 1.1rem;
  transition: background $fast;

  &:hover {
    background: $light-gray;
  }
}

.text {
  flex-grow: 1;
  text-align: left;
}

.icon {
  margin-left: 10px;
  color: $gray;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.caret {
  position: relative;
  top: 2px;
  transition: transform $fast;

  &[data-expanded="true"] {
    transform: rotate(-180deg);
  }
}
</style>
