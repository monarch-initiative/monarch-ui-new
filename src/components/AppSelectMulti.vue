<template>
  <div class="select">
    <!-- select button -->
    <slot
      v-if="hasSlot"
      :id="`select_${id}`"
      role="combobox"
      :aria-label="name"
      aria-multiselectable="true"
      :aria-expanded="expanded"
      :aria-controls="`list_${id}`"
      aria-haspopup="listbox"
      :aria-activedescendant="`option_${id}_${highlighted}`"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
      :notification="!!selected.length"
    ></slot>
    <button
      v-else
      :id="`select_${id}`"
      class="button"
      role="combobox"
      :aria-label="name"
      aria-multiselectable="true"
      :aria-expanded="expanded"
      :aria-controls="`list_${id}`"
      aria-haspopup="listbox"
      :aria-activedescendant="`option_${id}_${highlighted}`"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <span v-if="selected.length">
        {{ abbreviated.first }}
        <span v-if="abbreviated.more" class="more">
          (+{{ abbreviated.more }} more)
        </span>
      </span>
      <span v-else>{{ name }}</span>
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
      <table ref="list">
        <tr
          v-for="(option, index) in options"
          :key="index"
          :id="`option_${id}_${index}`"
          class="option"
          role="option"
          :aria-selected="selected.includes(index)"
          :data-selected="selected.includes(index)"
          :data-highlighted="index === highlighted"
          @click="() => toggleSelect(index)"
          @mouseenter="highlighted = index"
          @mousedown.prevent=""
          @touchstart.prevent=""
          @focusin="() => null"
          @keydown="() => null"
          tabindex="0"
        >
          <td class="check">
            <div :data-checked="selected.includes(index)" />
          </td>
          <td class="label">{{ option.label || option.value }}</td>
          <td class="count">{{ option.count }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { wrap } from "@/util/math";
import { defineComponent, PropType } from "vue";
import { isEqual, uniqueId } from "lodash";

// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/listbox/listbox-rearrangeable.html
// https://w3c.github.io/aria/#aria-multiselectable
// https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaMultiSelectable
// https://vuetifyjs.com/en/components/selects/

interface Option {
  value: number | string;
  icon?: string;
  label?: string;
  count?: number | string;
}
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
      type: Array as PropType<Options>,
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
    },
    // close dropdown
    close() {
      this.expanded = false;
    },
    // when button clicked
    onClick() {
      this.expanded ? this.close() : this.open();
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
        let value = this.highlighted;
        if (event.key === "ArrowUp") value = this.highlighted - 1;
        if (event.key === "ArrowDown") value = this.highlighted + 1;
        if (event.key === "Home") value = 0;
        if (event.key === "End") value = this.options.length - 1;

        // update value, wrapping beyond 0 or options length
        this.highlighted = wrap(value, this.options.length);
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
    // select or deselect option
    toggleSelect(index: number) {
      if (this.selected.includes(index))
        this.selected = this.selected.filter((value) => value !== index);
      else this.selected.push(index);
      this.selected.sort();
    },
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
        // emit change to selected option
        this.$emit("update:modelValue", this.getModel());
      },
      deep: true,
    },
    // when highlighted index changes, scroll to it in dropdown
    highlighted() {
      const list = this.$refs.list as HTMLElement;
      if (list)
        list.children[this.highlighted].scrollIntoView({ block: "nearest" });
    },
  },
  computed: {
    // if has slot
    hasSlot() {
      console.log(!!this.$slots.default);
      return !!this.$slots.default;
    },
    // abbreviated model value
    abbreviated() {
      let first = this.options[this.selected[0]];
      return {
        first: first.label || first.value,
        more: this.selected.length - 1,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.select {
  position: relative;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border-radius: $rounded;
  background: $light-gray;
}

.list {
  position: absolute;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  background: $white;
  box-shadow: $shadow;
  z-index: 2;
}

table {
  border-collapse: collapse;
}

.option {
  cursor: pointer;
  transition: background $fast;
}

.option[data-selected="true"] {
  background: $theme-light;
}

.option[data-highlighted="true"] {
  background: $light-gray;
}

.check {
  padding: 8px;

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

.label {
  padding: 5px;
  text-align: left;
}

.count {
  padding: 5px;
  padding-left: 20px;
  color: $gray;
  text-align: right;
}

.more {
  color: $gray;
  font-size: 0.9rem;
}
</style>
