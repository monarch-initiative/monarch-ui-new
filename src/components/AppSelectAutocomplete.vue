<!--
  custom dropdown select component with type-in async search

  references:
  https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/combobox/combobox-autocomplete-list.html
  https://vuetifyjs.com/en/components/autocompletes
  https://www.downshift-js.com/use-combobox
-->

<template>
  <div class="select-autocomplete">
    <!-- select box -->
    <AppTextbox
      :id="`select-${id}`"
      ref="target"
      v-model="search"
      class="box"
      icon="search"
      role="combobox"
      :placeholder="placeholder"
      :debounce="200"
      :aria-label="name"
      :aria-expanded="!!results.length"
      :aria-controls="`list-${id}`"
      aria-haspopup="listbox"
      aria-autocomplete="list"
      @focus="onFocus"
      @blur="onBlur"
      @debounce="onDebounce"
      @change="onChange"
      @keydown="onKeydown"
    />

    <!-- dropdown -->
    <Teleport to="body">
      <div
        v-if="expanded"
        :id="`list-${id}`"
        ref="dropdown"
        class="list"
        role="listbox"
        tabindex="0"
        :aria-labelledby="`select-${id}`"
        :aria-activedescendant="
          results.length ? `option-${id}-${highlighted}` : undefined
        "
        :style="style"
      >
        <!-- status -->
        <AppStatus v-if="isLoading" code="loading" role="option"
          >Loading results</AppStatus
        >
        <AppStatus v-if="isError" code="error" role="option"
          >Error loading results</AppStatus
        >

        <!-- list of results -->
        <div v-if="results.length" class="grid">
          <div
            v-for="(option, index) in results"
            :id="`option-${id}-${index}`"
            :key="index"
            class="option"
            role="option"
            :aria-selected="true"
            :data-highlighted="index === highlighted"
            tabindex="0"
            @click="select(option.name)"
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
                v-html="option.highlight || option.name"
              ></span>
            </span>
            <span class="option-info truncate">{{ option.info }}</span>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- description -->
    <div v-if="description" class="description">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { uniqueId } from "lodash";
import { OptionsFunc } from "./AppSelectAutocomplete";
import AppStatus from "@/components/AppStatus.vue";
import { wrap } from "@/util/math";
import { useFloating, useQuery } from "@/util/composables";
import AppTextbox from "./AppTextbox.vue";

interface Props {
  /** two-way bound selected items state */
  modelValue?: string;
  /** name of the field */
  name: string;
  /** placeholder string when nothing typed in */
  placeholder?: string;
  /** async function that returns list of options to show */
  options: OptionsFunc;
  /** description to show below box */
  description?: string;
}

const props = defineProps<Props>();

interface Emits {
  /** two-way bound selected items state */
  (event: "update:modelValue", value: string): void;
  /** when input focused */
  (event: "focus"): void;
  /** when input value change "submitted"/"committed" by user */
  (event: "change", value: string): void;
}

const emit = defineEmits<Emits>();

/** unique id for instance of component */
const id = ref(uniqueId());
/** currently searched text */
const search = ref("");
/** index of option that is highlighted */
const highlighted = ref(0);
/** whether input box focused and dropdown expanded */
const expanded = ref(false);

/** open results dropdown */
async function open() {
  expanded.value = true;
  highlighted.value = -1;
  await getResults();
}

/** close results dropdown */
function close() {
  expanded.value = false;
  highlighted.value = -1;
  results.value = [];
  if (document.activeElement?.matches("input"))
    (document.activeElement as HTMLElement)?.blur();
}

/** when user focuses box */
function onFocus() {
  emit("focus");
  open();
}

/** when user blurs box */
async function onBlur() {
  close();
}

/** when user types some text, after a delay */
async function onDebounce() {
  await getResults();
}

/** when user "commits" change to value, e.g. pressing enter, de-focusing, etc */
function onChange(value: string) {
  select(value);
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
    if (event.key === "End") index = results.value.length - 1;

    /** update highlighted, wrapping beyond 0 or results length */
    highlighted.value = wrap(index, 0, results.value.length);
  }

  /** enter key to select highlighted result */
  if (event.key === "Enter" && highlighted.value >= 0) {
    /** prevent browser re-clicking open button */
    event.preventDefault();
    select(results.value[highlighted.value].name);
  }

  /** esc key to close dropdown */
  if (event.key === "Escape") close();
}

/** select an option */
async function select(value: string) {
  search.value = value;
  emit("change", value);
  close();
}

const {
  query: getResults,
  data: results,
  isLoading,
  isError,
} = useQuery(
  /** get list of results */
  async function () {
    /** get results */
    return await props.options(search.value);
  },

  /** default value */
  []
);

/** target element */
const target = ref();
/** dropdown element */
const dropdown = ref();
/** get dropdown position */
const { calculate, style } = useFloating(true);
/** recompute position when length of results changes */
watch([expanded, results], async () => {
  await nextTick();
  if (expanded.value) calculate(target.value.textbox, dropdown.value);
});

/** when model changes, update search */
watch(
  () => props.modelValue,
  () => (search.value = props.modelValue || ""),
  { immediate: true }
);

/** when search changes, update model */
watch(search, () => emit("update:modelValue", search.value));

/** when highlighted index changes */
watch(highlighted, () => {
  /** scroll to highlighted in dropdown */
  document
    .querySelector(`#option-${id.value}-${highlighted.value} > *`)
    ?.scrollIntoView({ block: "nearest" });
});
</script>

<style lang="scss" scoped>
.select-autocomplete {
  position: relative;
  width: 100%;
}

.box {
  width: 100%;
  min-height: 40px;
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

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.list {
  max-height: 300px;
  overflow-x: auto;
  overflow-y: auto;
  background: $white;
  box-shadow: $shadow;
  z-index: 12;
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
