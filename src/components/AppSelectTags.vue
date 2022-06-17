<!--
  custom tag select component with type-in async search and chips

  references:
  https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/combobox/combobox-autocomplete-list.html
  https://vuetifyjs.com/en/components/autocompletes
  https://www.downshift-js.com/use-combobox
-->

<template>
  <div class="select-tags">
    <!-- box -->
    <div class="box" :data-focused="focused">
      <!-- deselect button -->
      <AppButton
        v-for="(option, index) in selected"
        :key="index"
        v-tippy="`Deselect ${option.id}`"
        design="circle"
        :text="option.name || option.id"
        icon="xmark"
        class="selected"
        :aria-label="`Deselect ${option.id}`"
        @click="deselect(option)"
      />

      <AppFlex>
        <!-- input box -->
        <input
          v-model="search"
          v-tippy="{ content: tooltip, offset: [20, 20] }"
          :placeholder="placeholder"
          role="combobox"
          :aria-label="name"
          :aria-expanded="!!results.length"
          :aria-controls="`list-${id}`"
          aria-haspopup="listbox"
          :aria-activedescendant="
            focused ? `option-${id}-${highlighted}` : undefined
          "
          aria-autocomplete="list"
          @focus="focused = true"
          @blur="focused = false"
          @keydown="onKeydown"
          @paste="onPaste"
        />

        <span class="meta">
          <!-- copy ids -->
          <AppButton
            v-tippy="`Copy selected values`"
            design="small"
            icon="copy"
            @click="copy"
          />
          {{ " " }}
          <!-- clear box -->
          <AppButton
            v-tippy="`Clear selected values`"
            design="small"
            icon="times"
            @click="clear"
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
      <AppStatus v-if="status" :status="status" />

      <!-- list of results -->
      <div v-if="results.length" class="grid">
        <div
          v-for="(option, index) in availableResults"
          :id="`option-${id}-${index}`"
          :key="index"
          class="option"
          role="option"
          :aria-selected="true"
          :data-highlighted="index === highlighted"
          tabindex="0"
          @click="select(option)"
          @mouseenter="highlighted = index"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
        >
          <span class="option-icon">
            <AppIcon :icon="option.icon || ''" />
          </span>
          <span class="option-label">
            <span
              class="truncate"
              v-html="option.highlight || option.name || option.id"
            ></span>
          </span>
          <span class="option-info truncate">{{ option.info }}</span>
        </div>
      </div>
    </div>

    <!-- description -->
    <div v-if="description" class="description">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { uniqueId, isEqual, debounce, uniqBy } from "lodash";
import { Option, Options, OptionsFunc } from "./AppSelectTags";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import { ApiError } from "@/api";
import { wrap } from "@/util/math";
import { snackbar } from "./TheSnackbar";
import { sleep } from "@/util/debug";

interface Props {
  /** name of the field */
  name: string;
  /** placeholder string when nothing typed in */
  placeholder?: string;
  /** currently selected item */
  modelValue: Options;
  /** async function that returns list of options to show */
  options: OptionsFunc;
  /** tooltip when hovering input */
  tooltip?: string;
  /** description to show below box */
  description?: string;
}

const props = defineProps<Props>();

interface Emits {
  /** two-way binding value */
  (event: "update:modelValue", value: Options): void;
  /** when value change "submitted"/"committed" by user */
  (event: "change"): void;
  /** when an option has been auto accepted (e.g. text pasted) */
  (event: "autoAccept"): void;
  /** when an option's getOptions func has been called */
  (event: "getOptions", option: Option, options: Options): void;
}

const emit = defineEmits<Emits>();

/** unique id for instance of component */
const id = ref(uniqueId());
/** array of selected options */
const selected = ref<Options>([]);
/** currently searched text */
const search = ref("");
/** results for searched text */
const results = ref<Options>([]);
/** index of option that is highlighted */
const highlighted = ref(0);
/** whether input box focused */
const focused = ref(false);
/** status of query */
const status = ref<Status | null>(null);

/** close results dropdown */
function close() {
  search.value = "";
  results.value = [];
  highlighted.value = 0;
  debouncedGetResults.cancel();
}

/** when user presses key in input */
function onKeydown(event: KeyboardEvent) {
  /** arrow/home/end keys */
  if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
    /** prevent page scroll */
    event.preventDefault();

    /** move value up/down */
    let index = highlighted.value;
    if (event.key === "ArrowUp") index--;
    if (event.key === "ArrowDown") index++;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = availableResults.value.length - 1;

    /** update highlighted, wrapping beyond 0 or results length */
    highlighted.value = wrap(index, 0, availableResults.value.length);
  }

  /** backspace key to deselect last-selected option */
  if (event.key === "Backspace") {
    if (search.value === "") deselect();
  }

  /** enter key to de/select highlighted result */
  if (event.key === "Enter") {
    /** prevent browser re-clicking open button */
    event.preventDefault();
    if (availableResults.value[highlighted.value]) {
      select(availableResults.value[highlighted.value]);
      /** if highlighted beyond last option, clamp */
      if (highlighted.value > availableResults.value.length - 1)
        highlighted.value = availableResults.value.length - 1;
    }
  }

  /** esc key to close dropdown */
  if (event.key === "Escape") close();
}

/** when user pastes text */
async function onPaste() {
  /** wait for pasted value to take effect but don't use nextTick because by then search.value will be reset */
  await sleep();
  /** immediately auto-accept results */
  getResults();
}

/** select an option or array of options */
async function select(options: Option | Options) {
  /** make array if single option */
  if (!Array.isArray(options)) options = [options];

  /** array of options to select */
  const toSelect: Options = [];

  for (const option of options) {
    /** run func to get options to select */
    if (option.getOptions) {
      const options = await option.getOptions();
      toSelect.push(...options);
      /** notify parent that dynamic options were added. provide option selected and options added. */
      emit("getOptions", option, options);
    }
    /** otherwise just select option */
    else toSelect.push(option);
  }

  /** select options */
  selected.value.push(...toSelect);

  /** notify parent that user made change to selection */
  emit("change");
}

/** deselect a specific option or last-selected option */
function deselect(option?: Option) {
  if (option)
    selected.value = selected.value.filter((model) => model.id !== option.id);
  else selected.value.pop();

  /** notify parent that user made change to selection */
  emit("change");
}

/** clear all selected */
function clear() {
  selected.value = [];
}

/** copy selected ids to clipboard */
async function copy() {
  await window.navigator.clipboard.writeText(
    selected.value.map(({ id }) => id).join(",")
  );
  snackbar(`Copied ${selected.value.length} values`);
}

/** get list of results */
async function getResults() {
  /** cancel any pending calls */
  debouncedGetResults.cancel();

  /** loading... */
  status.value = { code: "loading", text: "Loading results" };
  results.value = [];
  highlighted.value = 0;

  try {
    /** get results */
    const response = await props.options(search.value);
    /** if auto accept flag set, immediately accept/select passed options */
    if ("autoAccept" in response && "options" in response) {
      select(response.options);
      search.value = "";
      emit("autoAccept");
      snackbar(response.message);
    }
    /** otherwise, show list of results for user to select */
    else {
      results.value = response;
    }

    /** clear status */
    status.value = null;
  } catch (error) {
    /** error... */
    status.value = error as ApiError;
  }
}

/** list of unselected results to show */
const availableResults = computed(() =>
  results.value.filter(
    (option) => !selected.value.find((model) => model.id === option.id)
  )
);

/** when model changes */
watch(
  () => props.modelValue,
  () => {
    /** avoid infinite rerenders */
    if (!isEqual(selected.value, props.modelValue))
      /** update (de-duplicated) selected value */
      selected.value = uniqBy(props.modelValue, "id");
  },
  { deep: true, immediate: true }
);

/** when selected value changes */
watch(
  selected,
  () => {
    /** emit (deduplicated) updated model */
    emit("update:modelValue", uniqBy(selected.value, "id"));
  },
  { deep: true }
);

/** run async get results func when search text changes */
watch(search, async () => debouncedGetResults());

/** when focused state changes */
watch(focused, () => {
  status.value = { code: "loading" };
  /** get results when first focused */
  if (focused.value) getResults();
  /** clear search when input box blurred */
  else close();
});

/** when highlighted index changes */
watch(highlighted, () => {
  /** scroll to highlighted in dropdown */
  document
    .querySelector(`#option-${id.value}-${highlighted.value} > *`)
    ?.scrollIntoView({ block: "nearest" });
});

/** make instance-unique debounced method of getting results (async options) */
const debouncedGetResults = debounce(getResults, 500);

onBeforeUnmount(() => {
  /** cancel any in-progress debounce */
  debouncedGetResults.cancel();
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
  max-height: 300px;
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
