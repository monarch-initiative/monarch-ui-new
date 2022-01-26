<template>
  <div class="select">
    <button
      ref="button"
      :id="`select_${id}`"
      class="combobox"
      :aria-expanded="expanded"
      :aria-controls="`list_${id}`"
      aria-haspopup="listbox"
      aria-label=""
      :aria-activedescendant="`option_${id}_${focused}`"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <span>{{ modelValue }}</span>
      <AppIcon :icon="expanded ? 'angle-up' : 'angle-down'" />
    </button>

    <div v-if="expanded" :id="`list_${id}`" class="listbox" role="listbox">
      <div
        v-for="(option, index) in options"
        :key="index"
        :id="`option_${id}_${index}`"
        class="option"
        role="option"
        :aria-selected="option === modelValue"
        :data-selected="option === modelValue"
        :data-focused="index === focused"
        @click="selected = index"
        @mouseenter="focused = index"
        @mousedown.prevent=""
        @touchstart.prevent=""
        @focusin="() => null"
        @keydown="() => null"
        tabindex="0"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { wrap } from "@/util/math";
import { defineComponent, PropType } from "vue";

// references
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role
// https://vuetifyjs.com/en/components/selects/

type Option = string;
type Options = Array<Option>;

let id = 0;

// custom select component for single, multi, and tags
export default defineComponent({
  props: {
    // currently selected item
    modelValue: {
      required: true,
    },
    // list of options to show
    options: {
      type: Array as PropType<Options>,
      required: true,
    },
  },
  data() {
    id++;
    return {
      // unique id for instance of component
      id: id,
      // whether dropdown is open
      expanded: false,
      // index of option that is selecte
      selected: this.getSelected(),
      // index of option that is focused
      focused: 0,
    };
  },
  methods: {
    // open dropdown
    open() {
      this.expanded = true;
    },
    // close dropdown
    close() {
      this.expanded = false;
    },
    // when button clicked
    onClick() {
      this.open();
      this.focused = this.selected;
    },
    // when button de-focused
    onBlur() {
      this.close();
    },
    // when user presses key on button
    onKeydown(event: KeyboardEvent) {
      // arrow/home/end keys
      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
        // prevent page scroll
        event.preventDefault();

        // if dropdown open, control focused option
        // if dropdown closed, control selected option
        const prop = this.expanded ? "focused" : "selected";

        // move value up/down
        let value = this[prop];
        if (event.key === "ArrowUp") value = this[prop] - 1;
        if (event.key === "ArrowDown") value = this[prop] + 1;
        if (event.key === "Home") value = 0;
        if (event.key === "End") value = this.options.length - 1;

        // update value, wrapping beyond 0 or options length
        this[prop] = wrap(value, this.options.length);
      }

      // enter key to select focused option
      if (this.expanded && event.key === "Enter") this.selected = this.focused;
    },
    // get selected option index from model value prop
    getSelected() {
      return this.options.findIndex((option) => option === this.modelValue);
    },
  },
  watch: {
    // when modelValue (selected option) changes, update selected index
    modelValue() {
      this.selected = this.getSelected();
    },
    // when selected index changes, emit change to selected option
    selected() {
      this.$emit("update:modelValue", this.options[this.selected]);
      this.close();
    },
  },
});
</script>

<style lang="scss">
.select {
  position: relative;
}

.combobox {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  background: $light-gray;
}

.listbox {
  position: absolute;
  background: $white;
  box-shadow: $shadow;
  z-index: 2;
}

.option {
  padding: 5px 10px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background $fast;
}

.option[data-focused="true"] {
  background: $light-gray;
}

.option[data-selected="true"] {
  background: $theme-light;
}
</style>
