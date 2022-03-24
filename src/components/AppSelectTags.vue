<template>
  <div class="select-tags">
    <!-- box -->
    <div class="box" :data-focused="focused">
      <!-- deselect button -->
      <AppButton
        v-for="(option, index) in selected"
        :key="index"
        design="circle"
        :text="option.name || option.id"
        icon="xmark"
        class="selected"
        :aria-label="`Deselect ${option.id}`"
        v-tippy="`Deselect ${option.id}`"
        @click="deselect(option)"
      />

      <AppFlex>
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
          @paste="onPaste"
          v-tippy="{ content: tooltip, offset: [20, 20] }"
        />

        <span class="meta">
          <!-- copy ids -->
          <AppButton
            design="small"
            icon="copy"
            @click="copy"
            v-tippy="`Copy selected values`"
          />
          {{ " " }}
          <!-- clear box -->
          <AppButton
            design="small"
            icon="times"
            @click="clear"
            v-tippy="`Clear selected values`"
          />
        </span>
      </AppFlex>
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
      <div class="grid" v-if="results.length">
        <div
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
          <span class="option-icon">
            <AppIcon :icon="option.icon || ''" />
          </span>
          <span class="option-label"
            ><span
              class="truncate"
              v-html="option.highlight || option.name || option.id"
            ></span
          ></span>
          <span class="option-info truncate">{{ option.info }}</span>
        </div>
      </div>
    </div>

    <!-- description -->
    <div v-if="description" class="description">{{ description }}</div>
  </div>
</template>

<script lang="ts">
// references:
// https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/combobox/combobox-autocomplete-list.html
// https://vuetifyjs.com/en/components/autocompletes

import { defineComponent, PropType } from "vue";
import { uniqueId, isEqual, debounce, DebouncedFunc, uniqBy } from "lodash";
import { Option, Options, OptionsFunc } from "./AppSelectTags";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import { ApiError } from "@/api";
import { wrap } from "@/util/math";
import { push } from "./TheSnackbar.vue";
import { sleep } from "@/util/debug";

// custom tag select component with type-in async search and chips
export default defineComponent({
  components: {
    AppStatus,
  },
  emits: ["update:modelValue", "change", "autoAccept", "getOptions"],
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
    // description to show below box
    description: String,
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
      debouncedGetResults: debounce(() => null) as DebouncedFunc<
        () => Promise<void>
      >,
    };
  },
  methods: {
    // close results dropdown
    close() {
      this.search = "";
      this.results = [];
      this.highlighted = 0;
      this.debouncedGetResults.cancel();
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
    // when user pastes text
    async onPaste() {
      // wait for pasted value to take effect
      // but don't use nextTick because by then this.search will be reset
      await sleep();
      // immediately auto-accept results
      this.getResults();
    },
    // select an option or array of options
    async select(options: Option | Options) {
      // make array if single option
      if (!Array.isArray(options)) options = [options];

      // array of options to select
      const toSelect: Options = [];

      for (const option of options) {
        // run func to get options to select
        if (option.getOptions) {
          const options = await option.getOptions();
          toSelect.push(...options);
          // notify parent that dynamic options were added
          // provide option selected and options added
          this.$emit("getOptions", option, options);
        }
        // otherwise just select option
        else toSelect.push(option);
      }

      // select options
      this.selected.push(...toSelect);

      // notify parent that user made change to selection
      this.$emit("change");
    },
    // deselect a specific option or last-selected option
    deselect(option?: Option) {
      if (option)
        this.selected = this.selected.filter((model) => model.id !== option.id);
      else this.selected.pop();

      // notify parent that user made change to selection
      this.$emit("change");
    },
    // clear all selected
    clear() {
      this.selected = [];
    },
    // copy selected ids to clipboard
    async copy() {
      await window.navigator.clipboard.writeText(
        this.selected.map(({ id }) => id).join(",")
      );
      push(`Copied ${this.selected.length} values`);
    },
    // get list of results
    async getResults() {
      // cancel any pending calls
      this.debouncedGetResults.cancel();

      // loading...
      this.status = { code: "loading", text: "Loading results" };
      this.results = [];
      this.highlighted = 0;

      try {
        // get results
        const response = await this.options(this.search);

        // if auto accept flag set, immediately accept/select passed options
        if ("autoAccept" in response && "options" in response) {
          this.select(response.options);
          this.search = "";
          this.$emit("autoAccept");
          push(response.message);
        }
        // otherwise, show list of results for user to select
        else {
          this.results = response;
          // if (!this.results.length) throw new ApiError("No results", "warning");
        }

        // clear status
        this.status = null;
      } catch (error) {
        // error...
        this.status = error as ApiError;
      }
    },
  },
  computed: {
    // list of unselected results to show
    availableResults() {
      return this.results.filter(
        (option) => !this.selected.find((model) => model.id === option.id)
      );
    },
  },
  watch: {
    // when model changes
    modelValue: {
      handler() {
        // avoid infinite rerenders
        if (!isEqual(this.selected, this.modelValue))
          // update (deduplicated) selected value
          this.selected = uniqBy(this.modelValue, "id");
      },
      deep: true,
      immediate: true,
    },
    // when selected value changes
    selected: {
      handler() {
        // emit (deduplicated) updated model
        this.$emit("update:modelValue", uniqBy(this.selected, "id"));
      },
      deep: true,
    },
    // run async get results func when search text changes
    async search() {
      this.debouncedGetResults();
    },
    // when focused state changes
    focused() {
      // get results when first focused
      if (this.focused) this.getResults();
      // clear search when input box blurred
      else this.close();
    },
    // when highlighted index changes
    highlighted() {
      // scroll to highlighted in dropdown
      document
        .querySelector(`#option-${this.id}-${this.highlighted} > *`)
        ?.scrollIntoView({ block: "nearest" });
    },
  },
  created() {
    // make instance-unique debounced method of getting results (async options)
    this.debouncedGetResults = debounce(this.getResults, 500);
  },
  beforeUnmount() {
    // cancel any in-progress debounce
    this.debouncedGetResults.cancel();
  },
});
</script>

<style lang="scss" scoped>
.select-tags {
  position: relative;
  width: 100%;
}

.box {
  display: flex;
  align-items: center;
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
  min-height: unset !important;
  font-size: 0.9rem;
}

.meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
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

.grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: 30px;
  justify-content: stretch;
  align-items: stretch;
}

.option {
  display: contents;
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

.option[data-highlighted="true"] > * {
  background: $light-gray;
}

.option-icon {
  color: $off-black;
}

.option-label {
  justify-content: flex-start;
}

.option-info {
  justify-content: flex-end;
  color: $gray;
}

.description {
  margin-top: 10px;
  color: $dark-gray;
  font-size: 0.9rem;
}
</style>
