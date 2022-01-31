<template>
  <div class="select">
    <!-- select button -->
    <button
      :id="`select_${id}`"
      class="button"
      role="combobox"
      :aria-label="name"
      :aria-expanded="expanded"
      :aria-controls="`list_${id}`"
      aria-haspopup="listbox"
      :aria-activedescendant="`option_${id}_${highlighted}`"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <span>{{ modelValue }}</span>
      <AppIcon :icon="expanded ? 'angle-up' : 'angle-down'" />
    </button>

    <!-- options list -->
    <div
      v-if="expanded"
      :id="`list_${id}`"
      class="list"
      role="listbox"
      tabindex="-1"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
        :id="`option_${id}_${index}`"
        class="option"
        role="option"
        :aria-selected="option === modelValue"
        :data-selected="option === modelValue"
        :data-highlighted="index === highlighted"
        @click="selected = index"
        @mouseenter="highlighted = index"
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
import { uniqueId } from "lodash";

// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/combobox/combobox-select-only.html
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role
// https://vuetifyjs.com/en/components/selects/
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

type Option = string;
type Options = Array<Option>;

// custom single select
export default defineComponent({
  props: {
    // name of the field
    name: {
      type: String,
      required: true,
    },
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
    return {
      // unique id for instance of component
      id: uniqueId(),
      // whether dropdown is open
      expanded: false,
      // index of option that is selected
      selected: this.getSelected(),
      // index of option that is highlighted
      highlighted: 0,
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
      this.highlighted = this.selected;
    },
    // when button blurred
    onBlur() {
      this.close();
    },
    // when user presses key on button
    onKeydown(event: KeyboardEvent) {
      // arrow/home/end keys
      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
        // prevent page scroll
        event.preventDefault();

        // if dropdown open, control highlighted option
        // if dropdown closed, control selected option
        const prop = this.expanded ? "highlighted" : "selected";

        // move value up/down
        let value = this[prop];
        if (event.key === "ArrowUp") value = this[prop] - 1;
        if (event.key === "ArrowDown") value = this[prop] + 1;
        if (event.key === "Home") value = 0;
        if (event.key === "End") value = this.options.length - 1;

        // update value, wrapping beyond 0 or options length
        this[prop] = wrap(value, this.options.length);
      }

      // enter key to select highlighted option
      if (this.expanded && (event.key === "Enter" || event.key === "Space"))
        this.selected = this.highlighted;

      // esc key to close dropdown
      if (this.expanded && event.key === "Escape") this.close();

      // TODO: type ahead
      // not strictly necessary for now because this component only used for
      // small number of options
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

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  background: $light-gray;
}

.list {
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

.option[data-highlighted="true"] {
  background: $light-gray;
}

.option[data-selected="true"] {
  background: $theme-light;
}
</style>
