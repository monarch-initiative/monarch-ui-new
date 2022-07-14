<!--
  custom multi select

  references:
  https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/listbox/listbox-rearrangeable.html
  https://w3c.github.io/aria/#aria-multiselectable
  https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaMultiSelectable
  https://vuetifyjs.com/en/components/selects/
  https://www.downshift-js.com/use-select
-->

<template>
  <div class="select-multi" :style="{ width: hasSlot ? '' : width }">
    <!-- select button -->
    <slot
      v-if="hasSlot"
      :id="`select-${id}`"
      :aria-label="name"
      :aria-expanded="expanded"
      :aria-controls="`list-${id}`"
      aria-haspopup="listbox"
      :notification="!allSelected"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    ></slot>
    <button
      v-else
      :id="`select-${id}`"
      class="button"
      :aria-expanded="expanded"
      :aria-controls="`list-${id}`"
      aria-haspopup="listbox"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <span class="button-label">
        {{ name }}
        <span class="button-more">
          <template v-if="selected.length === 0">none selected</template>
          <template v-else-if="selected.length === options.length">
            all selected
          </template>
          <template v-else-if="selected.length === 1">
            {{ options[selected[0]]?.id }}
          </template>
          <template v-else>{{ selected.length }} selected</template>
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
      :aria-activedescendant="
        expanded ? `option-${id}-${highlighted}` : undefined
      "
      tabindex="0"
      :data-slot="hasSlot"
    >
      <div class="grid">
        <!-- select all -->
        <div
          :id="`option-${id}--1`"
          class="option"
          role="menuitem"
          :aria-label="allSelected ? 'Deselect all' : 'Select all'"
          :data-selected="allSelected"
          :data-highlighted="highlighted === -1"
          tabindex="0"
          @click="() => toggleSelect(-1)"
          @mouseenter="highlighted = -1"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
        >
          <span class="option-icon">
            <AppIcon :icon="allSelected ? 'square-check' : 'square'" />
          </span>
          <span class="option-label">All</span>
          <span class="option-count"></span>
        </div>

        <div class="option-spacer"></div>

        <!-- options -->
        <div
          v-for="(option, index) in options"
          :id="`option-${id}-${index}`"
          :key="index"
          class="option"
          role="option"
          :aria-selected="selected.includes(index)"
          :data-selected="selected.includes(index)"
          :data-highlighted="index === highlighted"
          tabindex="0"
          @click="(event) => toggleSelect(index, event.shiftKey)"
          @mouseenter="highlighted = index"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
        >
          <span class="option-icon">
            <AppIcon
              :icon="selected.includes(index) ? 'square-check' : 'square'"
            />
          </span>
          <span class="option-label">{{ option.id }}</span>
          <span class="option-count">
            {{ showCounts ? option.count : "" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watch } from "vue";
import { isEqual, uniqueId } from "lodash";
import { Options } from "./AppSelectMulti";
import { wrap } from "@/util/math";

interface Props {
  /** two-way bound selected items state */
  modelValue: Options;
  /** name of the field */
  name: string;
  /** list of options to show */
  options: Options;
  /** width style of button */
  width?: string;
  /** whether to show count col */
  showCounts?: boolean;
}

const props = defineProps<Props>();

interface Emits {
  /** two-way bound selected items state */
  (event: "update:modelValue", value: Options): void;
  /** when value changed */
  (event: "input"): void;
  /** when value change "submitted"/"committed" by user */
  (event: "change", value: Options): void;
}

const emit = defineEmits<Emits>();

/** unique id for instance of component */
const id = ref(uniqueId());
/** whether dropdown is open */
const expanded = ref(false);
/** array of indices of selected options */
const selected = ref<Array<number>>([]);
/** selected state when dropdown was opened */
const last = ref<Array<number>>([]);
/** index of option that is highlighted */
const highlighted = ref(0);

function open() {
  /** open dropdown */
  expanded.value = true;
  /** auto highlight first selected option */
  highlighted.value = selected.value[0] || 0;
  /** remember selected state when opened */
  last.value = [...selected.value];
}

function close() {
  /** close dropdown */
  expanded.value = false;
  /** emit change, if value is different from when dropdown first opened */
  if (!isEqual(selected.value, last.value)) emit("change", getModel());
}

/** when button clicked */
function onClick() {
  /** toggle dropdown */
  expanded.value ? close() : open();
  /** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus */
  (document.querySelector(`#select-${id.value}`) as HTMLElement)?.focus();
}

/** when button blurred */
function onBlur() {
  close();
}

/** when user presses key on button */
function onKeydown(event: KeyboardEvent) {
  /** arrow/home/end keys */
  if (
    ["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) &&
    expanded.value
  ) {
    /** prevent page scroll */
    event.preventDefault();

    /** move value up/down */
    let index = highlighted.value;
    if (event.key === "ArrowUp") index--;
    if (event.key === "ArrowDown") index++;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = props.options.length - 1;

    /** update highlighted, wrapping beyond -1 or options length */
    highlighted.value = wrap(index, -1, props.options.length);
  }

  /** enter key to de/select highlighted option */
  if (expanded.value && (event.key === "Enter" || event.key === " ")) {
    /** prevent browser re-clicking open button */
    event.preventDefault();
    toggleSelect(highlighted.value);
  }

  /** esc key to close dropdown */
  if (expanded.value && event.key === "Escape") close();
}

/** get new selected option indices from model value */
function getSelected(): Array<number> {
  return props.options
    .map((option, index) =>
      props.modelValue.find((model) => option.id === model.id) ? index : -1
    )
    .filter((index) => index !== -1);
}

/** get new model value from selected option indices */
function getModel(): Options {
  return props.options.filter((_, index) => selected.value.includes(index));
}

/** select or deselect option(s) */
function toggleSelect(index = -1, shift = false) {
  /** toggle all */
  if (index === -1) {
    if (allSelected.value) selected.value = [];
    else
      selected.value = Array(props.options.length)
        .fill(0)
        .map((_, index) => index);
  } else if (shift) {
    /** solo/un-solo one */
    if (isEqual(selected.value, [index]))
      selected.value = Array(props.options.length)
        .fill(0)
        .map((_, index) => index);
    else selected.value = [index];
  } else {
    /** toggle one */
    if (selected.value.includes(index))
      selected.value = selected.value.filter((value) => value !== index);
    else selected.value.push(index);
  }

  /** keep in order for easy comparison */
  selected.value.sort();
  /** emit input event for listening for only user-originated inputs */
  emit("input");
}

/** when model changes, update selected indices */
watch(
  () => props.modelValue,
  () => {
    /** avoid infinite rerenders */
    if (!isEqual(selected.value, getSelected())) selected.value = getSelected();
  },
  { deep: true, immediate: true }
);

/** when selected index changes, update model */
watch(selected, () => emit("update:modelValue", getModel()), { deep: true });

/** when highlighted index changes */
watch(highlighted, () =>
  /** scroll to highlighted in dropdown */
  document
    .querySelector(`#option-${id.value}-${highlighted.value} > *`)
    ?.scrollIntoView({ block: "nearest" })
);

/** if has slot */
const hasSlot = computed(() => !!useSlots().default);

/** are all options selected */
const allSelected = computed(
  () => selected.value.length === props.options.length
);
</script>

<style lang="scss" scoped>
.select-multi {
  position: relative;
  max-width: 100%;
  text-transform: capitalize;
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
  color: $dark-gray;
  margin-left: 10px;
}

.list {
  position: absolute;
  min-width: 100%;
  max-width: 90vw;
  max-height: 300px;
  overflow-x: auto;
  overflow-y: auto;
  background: $white;
  box-shadow: $shadow;
  z-index: 2;
}

.list[data-slot="true"] {
  max-width: unset;
  left: 50%;
  transform: translateX(-50%);
}

.grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 30px 10px;
  grid-auto-rows: 30px;
  justify-content: stretch;
  align-items: stretch;
  min-width: max-content;
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

.option-spacer {
  grid-column: 1 / 4;
  height: 10px;
}

.option-icon {
  color: $theme;
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
