<template>
  <AppFlex gap="small" role="tablist">
    <AppButton
      v-for="(tab, index) in tabs"
      :key="index"
      :id="`tab_${id}_${tab.id}`"
      :text="tab.text"
      :icon="tab.icon"
      @click="selected = tab.id"
      design="circle"
      :active="selected === tab.id"
      :aria-selected="selected === tab.id"
      :aria-controls="`panel_${id}_${tab.id}`"
      role="tab"
      :tooltip="tab.tooltip"
      :aria-label="`Switch to ${tab.text} mode`"
    />
  </AppFlex>

  <div
    :id="`panel_${id}_${selected}`"
    :aria-labelledby="`tab_${id}_${selected}`"
    role="tabpanel"
  >
    <slot :name="selected"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { uniqueId } from "lodash";

// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/tabs/tabs-2/tabs.html

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
      // unique id for instance of component
      id: uniqueId(),
      // id of selected tab
      selected: (this.$props.default || this.$props.tabs[0].id || "") as string,
    };
  },
});
</script>
