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
      :tabindex="selected === tab.id ? 0 : -1"
      :aria-controls="`panel_${id}_${tab.id}`"
      role="tab"
      :tooltip="tab.tooltip"
      :aria-label="label"
      @keydown="onKeydown"
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
import { wrap } from "@/util/math";

// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/tabs/tabs-1/tabs.html

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
    // list of tabs with info
    tabs: {
      type: Array as PropType<Tabs>,
      required: true,
    },
    // default selected tab id
    default: String,
    // name of tab group
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // unique id for instance of component
      id: uniqueId(),
      // id of selected tab
      selected: (this.$props.default || this.$props.tabs[0].id || "") as string,
    };
  },
  methods: {
    // when user presses key on button
    onKeydown(event: KeyboardEvent) {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        // prevent page scroll
        event.preventDefault();

        // move selected tab
        let index = this.tabs.findIndex((tab) => tab.id === this.selected);
        if (event.key === "ArrowLeft") index--;
        if (event.key === "ArrowRight") index++;
        if (event.key === "Home") index = 0;
        if (event.key === "End") index = this.tabs.length - 1;

        // update selected, wrapping beyond -1 or options length
        this.selected = this.tabs[wrap(index, 0, this.tabs.length)].id;
      }
    },
  },
  watch: {
    selected() {
      (
        document.querySelector(
          `#tab_${this.id}_${this.selected}`
        ) as HTMLButtonElement
      )?.focus();
    },
  },
});
</script>
