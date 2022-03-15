<template>
  <div class="select-single">
    <!-- select button -->
    <button
      :id="`select-${id}`"
      class="button"
      role="combobox"
      :aria-label="name"
      :aria-expanded="expanded"
      :aria-controls="`list-${id}`"
      aria-haspopup="listbox"
      :aria-activedescendant="`option-${id}-${highlighted}`"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <span class="button-label">{{ modelValue }}</span>
      <AppIcon
        class="button-icon"
        :icon="expanded ? 'angle-up' : 'angle-down'"
      />
    </button>

    <!-- options list -->
    <div
      v-if="expanded"
      :id="`list_${id}`"
      class="list"
      role="listbox"
      tabindex="0"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
        :id="`option-${id}-${index}`"
        class="option"
        role="option"
        :aria-selected="option === modelValue"
        :data-selected="option === modelValue"
        :data-highlighted="index === highlighted"
        @click="selected = index"
        @mouseenter="highlighted = index"
        @mousedown.prevent=""
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
      type: String as PropType<Option>,
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
      // auto highlight selected option
      this.highlighted = this.selected;
    },
    // close dropdown
    close() {
      this.expanded = false;
    },
    // when button clicked
    onClick() {
      // toggle dropdown
      this.expanded ? this.close() : this.open();
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
      (
        document?.querySelector(`#select-${this.id}`) as HTMLButtonElement
      )?.focus();
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
        if (event.key === "ArrowUp") value--;
        if (event.key === "ArrowDown") value++;
        if (event.key === "Home") value = 0;
        if (event.key === "End") value = this.options.length - 1;

        // update value, wrapping beyond 0 or options length
        this[prop] = wrap(value, 0, this.options.length);
      }

      // enter key to select highlighted option
      if (this.expanded && (event.key === "Enter" || event.key === " ")) {
        // prevent browser re-clicking open button
        event.preventDefault();
        this.selected = this.highlighted;
      }

      // esc key to close dropdown
      if (this.expanded && event.key === "Escape") this.close();

      // TODO: type ahead
      // not strictly necessary for now because this component only used for
      // small number of options
    },
    // get selected option index from model
    getSelected() {
      return this.options.findIndex((option) => option === this.modelValue);
    },
  },
  watch: {
    // when model changes
    modelValue() {
      // update selected index
      this.selected = this.getSelected();
    },
    // when selected index changes
    selected() {
      // emit updated model
      this.$emit("update:modelValue", this.options[this.selected]);
      this.close();
    },
    // when highlighted index changes
    highlighted() {
      // scroll to highlighted in dropdown
      document
        .querySelector(`#option-${this.id}-${this.highlighted}`)
        ?.scrollIntoView({ block: "nearest" });
    },
  },
});
</script>

<style lang="scss" scoped>
.select-single {
  position: relative;
  max-width: 100%;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 5px 10px;
  border-radius: $rounded;
  background: $light-gray;
}

.button-label {
  flex-grow: 1;
  text-align: left;
}

.list {
  position: absolute;
  min-width: 100%;
  max-width: 90vw;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
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

.option[data-selected="true"] {
  background: $theme-light;
}

.option[data-highlighted="true"] {
  background: $light-gray;
}
</style>
