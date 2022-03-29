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
      <AppIcon v-if="modelValue.icon" :icon="modelValue.icon" />
      <span class="button-label">{{ modelValue.name || modelValue.id }}</span>
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
      <div class="grid">
        <div
          v-for="(option, index) in options"
          :key="index"
          :id="`option-${id}-${index}`"
          class="option"
          role="option"
          :aria-selected="selected === index"
          :data-selected="selected === index"
          :data-highlighted="index === highlighted"
          @click="selected = index"
          @mouseenter="highlighted = index"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
          tabindex="0"
        >
          <span class="option-icon">
            <AppIcon v-if="option.icon" :icon="option.icon" />
          </span>
          <span class="option-label">{{ option.name || option.id }}</span>
          <span class="option-count">{{ option.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { uniqueId } from "lodash";
import { Option, Options } from "./AppSelectSingle";
import { wrap } from "@/util/math";

// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/combobox/combobox-select-only.html
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role
// https://vuetifyjs.com/en/components/selects/

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
      type: Object as PropType<Option>,
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
      return this.options.findIndex(
        (option) => option?.id === this.modelValue?.id
      );
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
    // when available options change
    options: {
      handler() {
        // if can't find selected value, select first option
        if (this.selected === -1) this.selected = 0;
      },
      immediate: true,
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
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  max-width: 90vw;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  background: $white;
  box-shadow: $shadow;
  z-index: 2;
}

.grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: 30px;
  justify-content: stretch;
  align-items: stretch;
  min-width: max-content;
}

.option {
  display: contents;
  padding: 5px 10px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background $fast;
}

.option > * {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  overflow: hidden;

  &:first-child {
    padding-left: 10px;
  }

  &:last-child {
    padding-right: 10px;
  }
}

.option[data-selected="true"] > * {
  background: $theme-light;
}

.option[data-highlighted="true"] > * {
  background: $light-gray;
}

.option-icon {
  color: $off-black;
  font-size: 1.2rem;
}

.option-label {
  justify-content: flex-start;
}

.option-count {
  justify-content: flex-end;
  color: $gray;
}
</style>
