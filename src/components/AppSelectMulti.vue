<template>
  <div class="select" :style="{ width: hasSlot ? '' : width }">
    <!-- select button -->
    <slot
      v-if="hasSlot"
      :id="`select-${id}`"
      role="combobox"
      :aria-label="name"
      aria-multiselectable="true"
      :aria-expanded="expanded"
      :aria-controls="`list-${id}`"
      aria-haspopup="listbox"
      :aria-activedescendant="`option-${id}-${highlighted}`"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
      :notification="!allSelected"
    ></slot>
    <button
      v-else
      :id="`select-${id}`"
      class="button"
      role="combobox"
      :aria-label="name"
      aria-multiselectable="true"
      :aria-expanded="expanded"
      :aria-controls="`list-${id}`"
      aria-haspopup="listbox"
      :aria-activedescendant="`option-${id}-${highlighted}`"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <span class="button-label">
        {{ startCase(name) }}
        <span class="button-more">
          <template v-if="selected.length === 0">(none selected)</template>
          <template v-else-if="selected.length === options.length">
            (all selected)
          </template>
          <template v-else>({{ selected.length }} selected)</template>
        </span>
      </span>
      <AppIcon
        class="button-icon"
        :icon="expanded ? 'angle-up' : 'angle-down'"
      />
    </button>

    <!-- options list -->
    <div
      v-if="expanded"
      :id="`list-${id}`"
      class="list"
      role="listbox"
      tabindex="0"
    >
      <table>
        <!-- select all -->
        <tr
          :id="`option-${id}--1`"
          class="option"
          role="menuitem"
          :aria-label="allSelected ? 'Deselect all' : 'Select all'"
          :data-selected="allSelected"
          :data-highlighted="highlighted === -1"
          @click="() => toggleSelect(-1)"
          @mouseenter="highlighted = -1"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
          tabindex="0"
        >
          <td class="option-check">
            <div :data-checked="allSelected" />
          </td>
          <td class="option-label">All</td>
          <td class="option-count"></td>
        </tr>
        <tr>
          <td class="option-spacer" colspan="3"></td>
        </tr>
        <!-- options -->
        <tr
          v-for="(option, index) in options"
          :key="index"
          :id="`option-${id}-${index}`"
          class="option"
          role="option"
          :aria-selected="selected.includes(index)"
          :data-selected="selected.includes(index)"
          :data-highlighted="index === highlighted"
          @click="() => toggleSelect(index)"
          @mouseenter="highlighted = index"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
          tabindex="0"
        >
          <td class="option-check">
            <div :data-checked="selected.includes(index)" />
          </td>
          <td class="option-label">{{ startCase(String(option.value)) }}</td>
          <td class="option-count">{{ option.count }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { isEqual, uniqueId, startCase } from "lodash";
import { Options } from "./AppSelectMulti";
import { wrap } from "@/util/math";

// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/listbox/listbox-rearrangeable.html
// https://w3c.github.io/aria/#aria-multiselectable
// https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaMultiSelectable
// https://vuetifyjs.com/en/components/selects/

// custom single select
export default defineComponent({
  emits: ["update:modelValue", "change"],
  props: {
    // name of the field
    name: {
      type: String,
      required: true,
    },
    // currently selected item
    modelValue: {
      type: Array as PropType<Options>,
      required: true,
    },
    // list of options to show
    options: {
      type: Array as PropType<Options>,
      required: true,
    },
    // width style of button
    width: {
      type: String,
    },
  },
  data() {
    return {
      // unique id for instance of component
      id: uniqueId(),
      // whether dropdown is open
      expanded: false,
      // array of indices of selected options
      selected: [] as Array<number>,
      // index of option that is highlighted
      highlighted: 0,
    };
  },
  methods: {
    // open dropdown
    open() {
      this.expanded = true;
      // auto highlight first selected option
      this.highlighted = this.selected[0] || 0;
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
      if (
        ["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) &&
        this.expanded
      ) {
        // prevent page scroll
        event.preventDefault();

        // move value up/down
        let highlighted = this.highlighted;
        if (event.key === "ArrowUp") highlighted--;
        if (event.key === "ArrowDown") highlighted++;
        if (event.key === "Home") highlighted = 0;
        if (event.key === "End") highlighted = this.options.length - 1;

        // update highlighted, wrapping beyond -1 or options length
        this.highlighted = wrap(highlighted, -1, this.options.length);
      }

      // enter key to de/select highlighted option
      if (this.expanded && (event.key === "Enter" || event.key === " ")) {
        // prevent browser re-clicking open button
        event.preventDefault();
        this.toggleSelect(this.highlighted);
      }

      // esc key to close dropdown
      if (this.expanded && event.key === "Escape") this.close();

      // TODO: type ahead
    },
    // get new selected option indices from model
    getSelected(): Array<number> {
      return this.options
        .map((option, index) =>
          this.modelValue.find((model) => option.value === model.value)
            ? index
            : -1
        )
        .filter((index) => index !== -1);
    },
    // get new model from selected option indices
    getModel(): Options {
      return this.options.filter((_, index) => this.selected.includes(index));
    },
    // select or deselect option(s)
    toggleSelect(index = -1) {
      // toggle all
      if (index === -1) {
        if (this.allSelected) this.selected = [];
        else
          this.selected = Array(this.options.length)
            .fill(0)
            .map((_, index) => index);
      }
      // toggle one
      else {
        if (this.selected.includes(index))
          this.selected = this.selected.filter((value) => value !== index);
        else this.selected.push(index);
      }
      // keep in order for easy comparison
      this.selected.sort();
      // emit change event for listening for only user-originated changes
      this.$emit("change");
    },
    startCase,
  },
  watch: {
    // when model changes, update selected indices
    modelValue: {
      handler() {
        // avoid infinite rerenders
        if (!isEqual(this.selected, this.getSelected()))
          this.selected = this.getSelected();
      },
      deep: true,
      immediate: true,
    },
    // when selected index changes
    selected: {
      handler() {
        // emit updated model
        this.$emit("update:modelValue", this.getModel());
      },
      deep: true,
    },
    // when highlighted index changes
    highlighted() {
      // scroll to highlighted in dropdown
      document
        .querySelector(`#option-${this.id}-${this.highlighted}`)
        ?.scrollIntoView({ block: "nearest" });
    },
  },
  computed: {
    // if has slot
    hasSlot() {
      return !!this.$slots.default;
    },
    // are all options selected
    allSelected() {
      return this.selected.length === this.options.length;
    },
  },
});
</script>

<style lang="scss" scoped>
.select {
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

.button-more {
  color: $gray;
  font-size: 0.9rem;
}

.list {
  position: absolute;
  max-height: 200px;
  min-width: 100%;
  overflow-y: auto;
  background: $white;
  box-shadow: $shadow;
  z-index: 2;
}

table {
  table-layout: fixed;
  min-width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

.option {
  cursor: pointer;
  transition: background $fast;
}

.option[data-highlighted="true"] {
  background: $light-gray;
}

.option-spacer {
  height: 5px;
}

.option-check {
  padding: 10px;
  width: 40px;

  div {
    width: 20px;
    height: 20px;
    border-radius: $rounded;
    border: solid 2px $theme;
  }

  div[data-checked="true"] {
    background: $theme;
    background-image: url("~@/assets/checkmark.svg");
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
}

.option-label {
  padding: 5px;
  text-align: left;
}

.option-count {
  padding: 10px;
  padding-left: 20px;
  color: $gray;
  text-align: right;
}
</style>
