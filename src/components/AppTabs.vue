<template>
  <AppFlex gap="small">
    <AppButton
      v-for="(tab, index) in tabs"
      :key="index"
      :id="`${tab.id}-tab`"
      :text="tab.text"
      :icon="tab.icon"
      @click="selected = tab.id"
      design="circle"
      :active="selected === tab.id"
      :aria-selected="selected === tab.id"
      :aria-controls="`${selected}-panel`"
      role="tab"
      :tooltip="tab.tooltip"
      :aria-label="`Switch to ${tab.text} mode`"
    />
  </AppFlex>

  <div
    :id="`${selected}-panel`"
    :aria-labelledby="`${selected}-tab`"
    role="tabpanel"
  >
    <slot :name="selected"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface Tab {
  // unique id
  id: string;
  // tab button props
  text?: string;
  icon?: string;
  tooltip?: string;
}
type Tabs = Array<Tab>;

// tab buttons that conditionally show their corresponding slots
export default defineComponent({
  props: {
    tabs: {
      type: Array as PropType<Tabs>,
      required: true,
    },
    default: String,
  },
  data() {
    return {
      selected: (this.$props.default || this.$props.tabs[0].id || "") as string,
    };
  },
});
</script>
