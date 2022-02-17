<template>
  <AppFlex role="tablist">
    <AppButton
      v-for="(tab, index) in tabs"
      :key="index"
      :id="`tab-${id}-${tab.id}`"
      :text="tab.text"
      :icon="tab.icon"
      @click="selected = tab.id"
      design="circle"
      :color="selected === tab.id ? 'primary' : 'none'"
      :aria-selected="selected === tab.id"
      :tabindex="selected === tab.id ? 0 : -1"
      :aria-controls="`panel-${id}-${tab.id}`"
      role="tab"
      :tooltip="tab.tooltip"
      :aria-label="name"
      @keydown="onKeydown"
    />
  </AppFlex>

  <AppFlex
    gap="big"
    :id="`panel-${id}-${selected}`"
    class="panel"
    :aria-labelledby="`tab-${id}-${selected}`"
    role="tabpanel"
  >
    <slot :name="selected"></slot>
  </AppFlex>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { uniqueId } from "lodash";
import { wrap } from "@/util/math";

// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/tabs/tabs-1/tabs.html

interface Tab {
  // page-wide unique id of tab
  id: string;
  // tab button props
  text?: string;
  icon?: string;
  tooltip?: string;
}
type Tabs = Array<Tab>;

// tab buttons that conditionally show their corresponding slots
export default defineComponent({
  emits: ["change"],
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
      selected: (this.getHash() ||
        this.$props.default ||
        this.$props.tabs[0].id ||
        "") as string,
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
    // when hash in url is changed or loaded
    getHash() {
      // set selected tab to id in hash
      const hash = this.$route.hash.slice(1);
      if (this.tabs.find((tab) => tab.id === hash)) return hash;
    },
  },
  watch: {
    // when selected tab changes
    selected() {
      // focus the selected tab
      const selector = `#tab-${this.id}-${this.selected}`;
      const button = document.querySelector(selector) as HTMLButtonElement;
      button?.focus();

      // emit event to parent that tab changed.
      this.$emit("change", this.selected);
    },
    // when url hash changes
    $route() {
      // update selected
      const hash = this.getHash();
      if (hash) this.selected = hash;
    },
  },
});
</script>

<style lang="scss" scoped>
.panel {
  width: 100%;
}
</style>
