<template>
  <div class="select">
    <!-- box -->
    <div class="box" :data-focused="focused">
      <!-- deselect button -->
      <button
        v-for="(selected, index) in modelValue"
        :key="index"
        class="selected"
        :aria-label="`Deselect ${selected.value}`"
        v-tippy="{ content: `Deselect ${selected.value}`, offset: [20, 20] }"
        @click="deselect(selected)"
      >
        {{ selected.value }}
        <AppIcon icon="xmark" />
      </button>

      <!-- input box -->
      <input
        v-model="search"
        :placeholder="placeholder"
        role="combobox"
        :aria-label="name"
        aria-multiselectable="true"
        :aria-expanded="!!results.length"
        :aria-controls="`list-${id}`"
        aria-haspopup="listbox"
        :aria-activedescendant="`option-${id}-${highlighted}`"
        aria-autocomplete="list"
        @focus="focused = true"
        @blur="focused = false"
        @keydown="onKeydown"
        v-tippy="{ content: tooltip, offset: [20, 20] }"
      />
    </div>

    <!-- dropdown -->
    <div
      v-if="focused"
      :id="`list-${id}`"
      class="list"
      role="listbox"
      tabindex="0"
    >
      <!-- status -->
      <AppStatus v-if="status" ref="status" :status="status" />

      <!-- list of results -->
      <table>
        <tr
          v-for="(option, index) in availableResults"
          :key="index"
          :id="`option-${id}-${index}`"
          class="option"
          role="option"
          :aria-selected="true"
          :data-highlighted="index === highlighted"
          @click="select(option)"
          @mouseenter="highlighted = index"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
          tabindex="0"
        >
          <td class="option-icon">
            <AppIcon :icon="option.icon || ''" />
          </td>
          <td class="option-label">{{ startCase(String(option.value)) }}</td>
          <td class="option-count">{{ option.count }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/combobox/combobox-autocomplete-list.html
// https://vuetifyjs.com/en/components/autocompletes

import { defineComponent, PropType } from "vue";
import { uniqueId, isEqual, startCase, debounce, DebouncedFunc } from "lodash";
import { Option, Options, OptionsFunc } from "./AppSelectTags";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import { ApiError } from "@/api";
import { wrap } from "@/util/math";

// custom tag select component with type-in async search and chips
export default defineComponent({
  components: {
    AppStatus,
  },
  emits: ["update:modelValue", "change"],
  props: {
    // name of the field
    name: {
      type: String,
      required: true,
    },
    // placeholder string when nothing typed in
    placeholder: String,
    // currently selected item
    modelValue: {
      type: Array as PropType<Options>,
      required: true,
    },
    // async function that returns list of options to show
    options: {
      type: Function as PropType<OptionsFunc>,
      required: true,
    },
    // tooltip when hovering input
    tooltip: {
      type: String,
    },
  },
  data() {
    return {
      // unique id for instance of component
      id: uniqueId(),
      // array of selected options
      selected: [] as Options,
      // currently searched text
      search: "",
      // results for searched text
      results: [] as Options,
      // index of option that is highlighted
      highlighted: 0,
      // whether input box focused
      focused: false,
      // status of query
      status: null as Status | null,
      // debounced get results function
      getResults: debounce(() => null) as DebouncedFunc<() => Promise<void>>,
    };
  },
  methods: {
    // close results dropdown
    close() {
      this.search = "";
      this.results = [];
      this.highlighted = 0;
      this.getResults.cancel();
    },
    // when user presses key in input
    onKeydown(event: KeyboardEvent) {
      // arrow/home/end keys
      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
        // prevent page scroll
        event.preventDefault();

        // move value up/down
        let highlighted = this.highlighted;
        if (event.key === "ArrowUp") highlighted--;
        if (event.key === "ArrowDown") highlighted++;
        if (event.key === "Home") highlighted = 0;
        if (event.key === "End") highlighted = this.availableResults.length - 1;

        // update highlighted, wrapping beyond 0 or results length
        this.highlighted = wrap(highlighted, 0, this.availableResults.length);
      }

      // backspace key to deselect last-selected option
      if (event.key === "Backspace") {
        if (this.search === "") this.deselect();
      }

      // enter key to de/select highlighted result
      if (event.key === "Enter") {
        // prevent browser re-clicking open button
        event.preventDefault();
        if (this.availableResults[this.highlighted]) {
          this.select(this.availableResults[this.highlighted]);
          // if highlighted beyond last option, clamp
          if (this.highlighted > this.availableResults.length - 1)
            this.highlighted = this.availableResults.length - 1;
        }
      }

      // esc key to close dropdown
      if (event.key === "Escape") this.close();
    },
    // select an option
    select(option: Option) {
      this.selected.push(option);
      this.search = "";
    },
    // deselect a specific option or last-selected option
    deselect(option?: Option) {
      if (option)
        this.selected = this.selected.filter(
          (model) => model.value !== option.value
        );
      else this.selected.pop();
    },
    startCase,
  },
  computed: {
    // list of unselected results to show
    availableResults() {
      return this.results.filter(
        (option) =>
          !this.modelValue.find((model) => model.value === option.value)
      );
    },
  },
  watch: {
    // when model changes, update selected value
    modelValue: {
      handler() {
        // avoid infinite rerenders
        if (!isEqual(this.selected, this.modelValue))
          this.selected = this.modelValue;
      },
      deep: true,
      immediate: true,
    },
    // when selected value changes
    selected: {
      handler() {
        // emit updated model
        this.$emit("update:modelValue", this.selected);
      },
      deep: true,
    },
    // run async get results func when search text changes
    async search() {
      this.getResults();
    },
    focused() {
      // get results when first focused
      if (this.focused) this.getResults();
      // clear search when input box blurred
      else this.close();
    },
  },
  created() {
    // make instance-unique debounced method of getting results (async options)
    this.getResults = debounce(async () => {
      // loading...
      this.status = { code: "loading", text: "Loading results" };
      this.results = [];
      this.highlighted = 0;

      try {
        // get results
        this.results = await this.options(this.search);

        // empty...
        if (!this.results.length) throw new ApiError("No results", "warning");

        // clear status
        this.status = null;
      } catch (error) {
        // error...
        this.status = error as ApiError;
      }
    }, 500);
  },
  beforeUnmount() {
    // cancel any in-progress debounce
    this.getResults.cancel();
  },
});
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  width: 100%;
}

.box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 5px 10px;
  background: $white;
  border: solid 2px $off-black;
  border-radius: $rounded;
  outline: none;
  transition: box-shadow $fast;
}

.box:hover,
.box[data-focused="true"] {
  box-shadow: $outline;
}

input {
  flex-grow: 1;
  appearance: none;
  border: none;
  outline: none;
}

.selected {
  display: flex;
  gap: 7.5px;
  background: $theme-light;
  padding: 2.5px 10px;
  border-radius: 999px;
  transition: background $fast;
}

.selected:hover {
  background: $gray;
}

.list {
  position: absolute;
  max-height: 200px;
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  background: $white;
  box-shadow: $shadow;
  z-index: 2;
}

table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

td {
  height: 35px;
  padding: 0 10px;
}

.option {
  cursor: pointer;
  transition: background $fast;
}

.option[data-highlighted="true"] {
  background: $light-gray;
}

.option-icon {
  width: 35px;
  color: $off-black;
}

.option-label {
  text-align: left;
}

.option-count {
  color: $gray;
  text-align: right;
}
</style>
